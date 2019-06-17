import GuardianEvents from './GuardianEvents';
import _ from './lowLodash';

export default class Common {
    constructor(config) {
        this.config = config;
        this.guardianEvents = new GuardianEvents();
    }

    // Event Handling
    on(type, observer) {
        observer.type = type;
        this.guardianEvents.subscribe(observer);
    }

    sendEvent(type, payload) {
        this.guardianEvents.sendEvent(type, payload);
    }


    // Property Get/Set-ters
    getStorage() {
        return this.config.getSetting('storage');
    }

    getStoredAuth() {
        const storage = this.config.getSetting('storage');
        return storage.retrieveAuth();
    }

    getCachedAuth() {
        const storage = this.config.getSetting('storage');
        return storage.retrieveCachedAuth();
    }

    setStoredAuth(payload) {
        const storage = this.config.getSetting('storage');
        return storage.persistAuth(payload);
    }

    clearStoredAuth() {
        const storage = this.config.getSetting('storage');
        return storage.clearAuth();
    }


    isLoggedIn() {
        const storedAuth = this.getCachedAuth();
        return _.has(storedAuth, 'accessToken') && _.get(storedAuth, 'loggedIn', false);
    }


    // URL Constructors
    getLoginUrl() {
        const authUrl = this.config.getSetting('authUrl');
        const authPathLogin = this.config.getSetting('authPathLogin');

        return `${authUrl}${authPathLogin}`;
    }

    getLogoutUrl() {
        const authUrl = this.config.getSetting('authUrl');
        const authPathLogout = this.config.getSetting('authPathLogout');

        return `${authUrl}${authPathLogout}`;
    }

    getLoginWithBallotQrUrl() {
        const authUrl = this.config.getSetting('authUrl');
        const authPathLoginWithBallotQrCode = this.config.getSetting('authPathLoginWithBallotQrCode');

        return `${authUrl}${authPathLoginWithBallotQrCode}`;
    }

    getLoginWithEventIdAndBallotCodeUrl() {
        const authUrl = this.config.getSetting('authUrl');
        const authPathLoginWithEventIdAndBallotCode = this.config.getSetting('authPathLoginWithEventIdAndBallotCode');

        return `${authUrl}${authPathLoginWithEventIdAndBallotCode}`;
    }

    getRefreshUrl() {
        const authUrl = this.config.getSetting('authUrl');
        const authPathRefresh = this.config.getSetting('authPathRefresh');

        return `${authUrl}${authPathRefresh}`;
    }

    getTokenLoginUrl() {
        const authUrl = this.config.getSetting('authUrl');
        const authPathRefresh = this.config.getSetting('authPathTokenLogin');

        return `${authUrl}${authPathRefresh}`;
    }

    getImpersonateUrl() {
        const authUrl = this.config.getSetting('authUrl');
        const authPathImpersonate = this.config.getSetting('authPathImpersonate');

        return `${authUrl}${authPathImpersonate}`;
    }

    getUserAccountUrl() {
        const accountsUrl = this.config.getSetting('accountsUrl');
        const accountsPathUser = this.config.getSetting('accountsPathUser');

        return `${accountsUrl}${accountsPathUser}`;
    }


    // Token Timing
    getSecondsLeft(expireTimeEpochSeconds) {
        if (!expireTimeEpochSeconds) {
            return 0;
        }

        const nowTimeEpochSeconds = (new Date()).getTime() / 1000;
        return expireTimeEpochSeconds - nowTimeEpochSeconds;
    }

    getSecondsLeftOnAccessToken() {
        const storedAuthentication = this.getCachedAuth();
        if (_.isEmpty(storedAuthentication)) {
            return 0;
        }

        const { expirationDate } = storedAuthentication;
        return expirationDate ? this.getSecondsLeft(expirationDate) : 0;
    }

    getExpireTimeEpochSeconds(expireInSeconds = 0) {
        const currentTime = new Date();
        return new Date((currentTime.getTime() / 1000) + expireInSeconds).getTime();
    };


    // Payload Parsing
    normalizeAuthorizationPayload(payload) {
        const data = _.has(payload, 'access_token') || _.has(payload, 'accessToken') ? payload : _.get(payload, 'data', {});
        const expiresIn = _.get(data, 'expires_in', _.get(data, 'expiresIn', ''));
        const accessToken = _.get(data, 'access_token', _.get(data, 'accessToken', ''));
        const refreshToken = _.get(data, 'refresh_token', _.get(data, 'refreshToken', ''));
        const subscriptionActive = _.get(data, 'subscription_active', null); // null in case field doesn't exist
        const loggedIn = true;
        const expirationDate = payload.expirationDate || this.getExpireTimeEpochSeconds(expiresIn);

        return Promise.resolve({ accessToken, refreshToken, expiresIn, loggedIn, expirationDate, subscriptionActive });
    };

    parseUrlQueryString(queryString) {
        const query = {};
        let pairs = queryString.split('&');
        pairs.forEach((nameValue) => {
            const pair = nameValue.split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        });

        return query;
    }

    getQueryParameterByName(name, removeParam = false) {
        const url = window.location.href;
        const formattedName = name.replace(/[\[\]]/g, '\\$&');
        const selectParamByName = new RegExp(`[?&]${formattedName}(=([^&#]*)|&|#|$)`);
        const results = selectParamByName.exec(url);
        const value = results && results[2] ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : null;
        if (value && removeParam) {
            const newUrl = url.replace(`${formattedName}=${value}`, '').replace('?&', '?').replace('&&', '&');
            if (window.history.pushState) {
                window.history.pushState({}, '', newUrl);
            } else {
                window.location.replace(newUrl);
            }
        }
        return value;
    }
}
