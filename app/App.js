import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { StyleSheet, View } from 'react-native'

import Router from './Router';

import { dark } from './colors';
import Loading from './components/Loading';
import ApiEndpoints from '../shared/config/apiEndpoints';
import firebaseConfig from '../shared/config/firebaseRealtimeConfig';
import { apolloLinkHandleAuthError, apolloLinkWithAuth, guardian } from '../shared/AuthGuard';
import AsyncStorageAuth from '../shared/AuthGuard/storage/AsyncStorageAuth';


const AppContext = React.createContext({});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;

let apolloClient;
const EVENT_ID_KEY = 'fanosityEventId';

export default class App extends Component {
    state = {
        guardianLoading: true,
        guardianLoggingOut: false,
        isLoggedIn: false,
        eventId: '',
        realtimeData: {},
        eventData: {}
    };

    changeEventId = (eventId, cb) => {
        AsyncStorage.setItem(EVENT_ID_KEY, eventId);
        this.setState({ eventId }, cb);
    };

    updateEventData = (eventData) => {
        this.setState({ eventData })
    };

    componentDidMount() {
        console.disableYellowBox = true;

        if (!firebase.apps || firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }

        ApiEndpoints.loadApiEndpoints()
            .then(({ authUrl, graphQlUrl }) => {
                const apolloLinkHttp = createHttpLink({ uri: graphQlUrl });
                apolloClient = new ApolloClient({
                    link: ApolloLink.from([
                        apolloLinkWithAuth,
                        apolloLinkHandleAuthError,
                        apolloLinkHttp
                    ]),
                    cache: new InMemoryCache()
                });

                const authSettings = { authUrl };
                return guardian.init(authSettings, AsyncStorageAuth)
            })
            .then(async () => {
                const isLoggedIn = guardian.isLoggedIn();
                const storedEventId = await AsyncStorage.getItem(EVENT_ID_KEY);

                if (isLoggedIn && storedEventId) {
                    this.setState({ isLoggedIn, eventId: storedEventId });
                }

                guardian.on('updatedToken', () => {
                    this.setState({ isLoggedIn: guardian.isLoggedIn() });
                });

                guardian.on('logoutPending', () => {
                    this.setState({ guardianLoggingOut: true });
                });

                guardian.on('logoutFailure', () => {
                    this.setState({ guardianLoggingOut: false });
                });

                guardian.on('logoutSuccess', () => {
                    this.setState({ guardianLoggingOut: false });
                });

                this.setState({ guardianLoading: false })
            })
            .catch((err) => {
                console.log('Error initializing the guardian', err);
            })
    }

    render() {
        const { guardianLoading, guardianLoggingOut } = this.state;

        if (guardianLoading || guardianLoggingOut) {
            return <Loading />;
        }

        return (
            <AppProvider value={{
                appState: this.state,
                changeEventId: this.changeEventId,
                updateEventData: this.updateEventData
            }}>
                <ApolloProvider client={apolloClient}>
                    <View style={styles.app}>
                        <Router />
                    </View>
                </ApolloProvider>
            </AppProvider>
        );
    }
}

const styles = StyleSheet.create({
    app: {
        flex: 1,
        backgroundColor: dark
    }
});
