import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { guardian, apolloLinkWithAuth, apolloLinkHandleAuthError } from 'Shared/AuthGuard';
import { FANOSITY_GRAPHQL_URL, FANOSITY_AUTH_URL } from 'Shared/config/apiEndpoints';
import App from './App';

import LocalStorageAuth from 'Shared/AuthGuard/storage/LocalStorageAuth';

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

guardian.init(authSettings, LocalStorageAuth)
    .then(() => {
        ReactDOM.render(
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>,
            document.getElementById('root')
        );
    });
