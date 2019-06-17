import axios from 'axios';
import { ApolloLink, Observable } from 'apollo-link';
import { onError } from 'apollo-link-error';
import _ from './lowLodash';
import Common from './Common';
import {
    refreshFailure, refreshPending, refreshSuccess, updatedToken,
    logoutSuccess, logoutPending, logoutFailure
} from './GuardianEvents';

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

let instance;

let refreshInProgress = false;
let logoutInProgress = false;
let blockedAxiosPromises = [];
let apolloTokenSubscribers = [];

export default class Guardian extends Common {
    constructor(config) {
        if (instance) {
            return instance;
        }
        super(config);
        instance = this;
    }

    async init(settings = {}, Storage) {
        const storage = new Storage(this.config);
        this.updateConfig({ ...settings, storage });
        return storage.refreshCache();
    }

    updateConfig(settings = {}) {
        this.config.update(settings);
    }

    getCurrentToken() {
        const currentStoredAuth = this.getCachedAuth();
        const tokenType = _.get(currentStoredAuth, 'tokenType', _.get(currentStoredAuth, 'token_type', 'Bearer'));
        const accessToken = _.get(currentStoredAuth, 'accessToken', _.get(currentStoredAuth, 'access_token', ''));

        return {
            tokenType,
            accessToken
        };
    }

    createTokenConfig(config) {
        const { tokenType, accessToken} = this.getCurrentToken();

        const additionalHeaders = {};
        const additionalData = {};
        const tokenAsParam = {};

        if (_.get(config, 'acceptJson', false)) {
            additionalHeaders.Accept = 'application/json';
        }

        if (_.get(config, 'sendTokenAsParam', false)) {
            tokenAsParam.access_token = accessToken;
        } else {
            additionalHeaders.Authorization = `${tokenType} ${accessToken}`;
        }

        if (_.get(config, 'sendTokenInBody', false)) {
            additionalData.access_token = accessToken;
        }

        // This is to catch object that have been parsed to JSON by axios on request retry
        let dataObject = config.data;
        const contentType = config.headers['Content-Type'];
        const isMultiPart = contentType != null && contentType.includes('multipart');

        if (!isMultiPart && typeof dataObject === 'string') {
            try {
                dataObject = JSON.parse(dataObject);
            } catch (e) {
                console.error(e);
            }
        }

        const isDataAnObject = typeof dataObject === 'object';
        const isFormData = dataObject instanceof FormData;
        if (isDataAnObject && !isFormData) {
            dataObject = {
                ...dataObject,
                ...additionalData
            };
        } else {
            dataObject = config.data;
        }

        return {
            ...config,
            headers: {
                ...config.headers,
                ...additionalHeaders
            },
            params: {
                ...config.params,
                ...tokenAsParam
            },
            data: dataObject || {},
            refreshAttempted: false,
            accessToken
        };
    }

    createDefer() {
        let resolve;
        let reject;
        const promise = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        });

        return {
            resolve,
            reject,
            promise
        };
    }

    retryAllBlockedRequests(err) {
        // Axios Requests
        _.forEach(blockedAxiosPromises, (promise) => {
            promise.resolve();
        });

        blockedAxiosPromises = [];

        // Apollo Requests
        apolloTokenSubscribers.map((cb) => cb(err));
    }

    apolloSubscribeTokenRefresh(cb) {
        apolloTokenSubscribers.push(cb);
    }

    getAxiosWithAuth() {
        const axiosWithAuth = axios.create();
        axiosWithAuth.interceptors.request.use(
            (config) => this.ensureValidAccessToken().then(() => this.createTokenConfig(config))
        );

        axiosWithAuth.interceptors.response.use(null, (error) => {
            const currentStoredAuth = this.getCachedAuth();
            const accessToken = _.get(currentStoredAuth, 'accessToken', _.get(currentStoredAuth, 'access_token', ''));
            const is401Error = error.config && error.response && error.response.status === 401;
            const wasRefreshAttempted = _.get(error, 'config.refreshAttempted', false);
            const hasAccessTokenChanged = _.get(error, 'config.accessToken', '') !== accessToken;

            if (is401Error && !refreshInProgress && !wasRefreshAttempted) {
               return this.refresh()
                    .then(() => this.createTokenConfig(error.config))
                    .then((config) => {
                        return axios.request({ ...config, refreshAttempted: true, accessToken })
                            .then((results) => {
                                this.retryAllBlockedRequests(null);
                                return results;
                            });
                    });
            } else if (is401Error && refreshInProgress) {
                const defer = this.createDefer();
                blockedAxiosPromises.push(defer);
                return defer.promise
                    .then(() => this.createTokenConfig(error.config))
                    .then((config) => axios.request({ ...config, refreshAttempted: true, accessToken }));
            } else if (is401Error && hasAccessTokenChanged && !wasRefreshAttempted) {
                return axios.request({ ...config, refreshAttempted: true, accessToken });
            }

            return Promise.reject(error);
        });

        return axiosWithAuth;
    }

    getApolloLinkWithAuth() {
        return new ApolloLink((operation, forward) =>
            new Observable((observer) => {
                let handle;

                this.ensureValidAccessToken()
                    .then(() => {
                        const { tokenType, accessToken} = this.getCurrentToken();

                        operation.setContext({
                            headers: {
                                Authorization: `${tokenType} ${accessToken}`
                            }
                        });
                    })
                    .then(() => {
                        handle = forward(operation).subscribe({
                            next: observer.next.bind(observer),
                            error: observer.error.bind(observer),
                            complete: observer.complete.bind(observer)
                        });
                    })
                    .catch(observer.error.bind(observer));

                return () => {
                    if (handle) {
                        handle.unsubscribe();
                    }
                };
            })
        );
    }

    getApolloLinkHandleAuthError() {
        return onError(({ graphQLErrors, networkError, operation, forward }) => {
            if (networkError) {
                console.error(`[Network error]: ${networkError}`);
            }

            if (graphQLErrors) {
                const { message, locations, path, extensions } = graphQLErrors[0];

                // TODO: GraphQL service should return the proper "UNAUTHENTICATED" code.
                //  checking "message" to make this work with what we have.  This should be removed
                //  once we have fixed the services.
                if (extensions.code === 'UNAUTHENTICATED' || message.indexOf('Unauthorized') > -1) {
                    return new Observable(async (observer) => {
                        try {
                            const retryRequest = () => {
                                const { tokenType, accessToken} = this.getCurrentToken();

                                operation.setContext({
                                    headers: {
                                        ...headers,
                                        Authorization: `${tokenType} ${accessToken}`
                                    },
                                });

                                const subscriber = {
                                    next: observer.next.bind(observer),
                                    error: observer.error.bind(observer),
                                    complete: observer.complete.bind(observer),
                                };

                                return forward(operation).subscribe(subscriber);
                            };

                            const { headers } = operation.getContext();
                            if (!refreshInProgress) {
                                try {
                                    await this.refresh();

                                    this.retryAllBlockedRequests(null);
                                    apolloTokenSubscribers = [];

                                    return retryRequest();
                                } catch (e) {
                                    this.retryAllBlockedRequests(new Error('Unable to refresh access token'));

                                    apolloTokenSubscribers = [];
                                }
                            }

                            return new Promise((resolve, reject) => {
                                this.apolloSubscribeTokenRefresh((errRefreshing) => {
                                    if (errRefreshing) return reject(errRefreshing);

                                    return resolve(retryRequest());
                                });
                            });
                        } catch (e) {
                            observer.error(e);
                        }
                    });
                } else {
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${
                            extensions.code
                            }`,
                    );
                }
            }
        });
    }

    ensureValidAccessToken() {
        if (refreshInProgress) {
            const defer = this.createDefer();
            blockedAxiosPromises.push(defer);
            return defer.promise;
        }

        const secondsLeft = this.getSecondsLeftOnAccessToken();
        if (secondsLeft > this.config.getSetting('refreshThresholdSeconds')) {
            return Promise.resolve();
        }

        const { accessToken = '', refreshToken = '' } = this.getCachedAuth();
        if (!accessToken && !refreshToken) {
            // They don't have any auth, so proceed without
            return Promise.resolve();
        }

        return this.refresh()
            .catch((error) => {
                console.log(error);
                console.log(error.stack);
            })
            .finally(() => {
                this.retryAllBlockedRequests();
            });
    }

    loginWithEmailAndPassword(email, password) {
        const loginUrl = this.getLoginUrl();
        const params = {
            password,
            email
        };

        return axios
            .post(loginUrl, params)
            .then(({ data }) => this.normalizeAuthorizationPayload(data))
            .then((normalizedPayload) => this.setStoredAuth(normalizedPayload))
            .then((payload) => {
                this.sendEvent(updatedToken, payload);
            });
    }

    loginBallotQrCode(scannedCode) {
        const loginUrl = this.getLoginWithBallotQrUrl();
        const params = {
            scannedCode
        };

        return axios
            .post(loginUrl, params)
            .then(({ data }) => this.normalizeAuthorizationPayload(data))
            .then((normalizedPayload) => this.setStoredAuth(normalizedPayload))
            .then((payload) => {
                this.sendEvent(updatedToken, payload);
            });
    }

    loginBallotEventIdAndCode(eventId, code) {
        const loginUrl = this.getLoginWithEventIdAndBallotCodeUrl();
        const params = {
            code,
            eventId
        };

        return axios
            .post(loginUrl, params)
            .then(({ data }) => this.normalizeAuthorizationPayload(data))
            .then((normalizedPayload) => this.setStoredAuth(normalizedPayload))
            .then((payload) => {
                this.sendEvent(updatedToken, payload);
            });
    }

    async refresh(refreshTokenOverride) {
        refreshInProgress = true;
        this.sendEvent(refreshPending);

        const refreshUrl = this.getRefreshUrl();

        let refreshToken = refreshTokenOverride || _.get(this.getCachedAuth(), 'refreshToken', '');

        if (_.isEmpty(refreshToken)) {
            this.sendEvent(refreshFailure);
            return this.logout();
        }

        const params = { refreshToken };

        return axios.post(refreshUrl, params)
            .then(({ data }) => this.normalizeAuthorizationPayload(data))
            .then((normalizedPayload) => this.setStoredAuth(normalizedPayload))
            .then((payload) => {
                refreshInProgress = false;
                this.sendEvent(refreshSuccess, payload);
                this.sendEvent(updatedToken, payload);
                return payload;
            })
            .catch((err) => {
                refreshInProgress = false;
                this.sendEvent(refreshFailure, err);
                return this.logout();
            });
    }

    async logout() {
        const { accessToken = '' } = this.getCachedAuth();

        if (logoutInProgress) {
            return Promise.resolve();
        }

        logoutInProgress = true;

        await this.clearStoredAuth();

        this.sendEvent(logoutPending);

        if (!_.isEmpty(accessToken)) {
            try {
                const logoutUrl = this.getLogoutUrl();
                const params = {
                    url: `${logoutUrl}?website=true`,
                    method: 'POST'
                };

                await axios({
                    ...params,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    data: {}
                });
            } catch (e) {
                console.log(e);
                this.sendEvent(logoutFailure, e);
            }
        }

        this.sendEvent(updatedToken, {});
        this.sendEvent(logoutSuccess);
        logoutInProgress = false;
    }
}
