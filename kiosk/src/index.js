import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { guardian, apolloLinkWithAuth, apolloLinkHandleAuthError } from 'Shared/AuthGuard';
import { FANOSITY_GRAPHQL_URL, FANOSITY_AUTH_URL } from 'Shared/config/apiEndpoints';
import LocalStorageAuth from 'Shared/AuthGuard/storage/LocalStorageAuth';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const apolloLinkHttp = createHttpLink({ uri: FANOSITY_GRAPHQL_URL });
export const client = new ApolloClient({
    link: ApolloLink.from([
        apolloLinkWithAuth,
        apolloLinkHandleAuthError,
        apolloLinkHttp
    ]),
    cache: new InMemoryCache()
});

const authSettings = {
    authUrl: FANOSITY_AUTH_URL
};

const isCordovaApp = !!window.cordova;

let setupQRScanner = async () => {
    console.log('QRScanner not found');
};

if (isCordovaApp) {
    setupQRScanner = async () => {
        return new Promise((resolve, reject) => {
            QRScanner.prepare((status) => resolve(status));
        });
    };
}


let waitForAppInitialization = async () => {
    return new Promise((resolve, reject) => {
        if (isCordovaApp) {
            document.addEventListener('deviceready', () => resolve(), false);
        } else {
            resolve();
        }
    });

};

guardian.init(authSettings, LocalStorageAuth)
    .then(async () => {
        await waitForAppInitialization();

        if (isCordovaApp) {
            AndroidFullScreen.leanMode(() => console.log('Alls good'), (err) => console.log(err));
            AndroidFullScreen.immersiveMode(() => console.log('Alls good'), (err) => console.log(err));
        }

        const status = await setupQRScanner();
        // TODO: add handling for status.denied

        ReactDOM.render(
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ApolloProvider>,
            document.getElementById('root')
        );
    });
