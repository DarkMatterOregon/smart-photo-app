import Guardian from './Guardian';
import Config from './Config';

let config;
let guardian;

if (!config) {
    config = new Config();
}

if (!guardian) {
    guardian = new Guardian(config);
}

const axios = guardian.getAxiosWithAuth();
const apolloLinkWithAuth = guardian.getApolloLinkWithAuth();
const apolloLinkHandleAuthError = guardian.getApolloLinkHandleAuthError();

export default guardian;

export {
    guardian,
    axios,
    apolloLinkWithAuth,
    apolloLinkHandleAuthError
};
