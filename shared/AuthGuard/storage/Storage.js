export default class Storage {
    constructor(config) {
        this.cachedAuth = {};
        this.config = config;
    }

    setCache(auth) {
        this.cachedAuth = auth;
    }

    persistAuth(authPayload) {
       console.log('persistAuth not implemented!');
    }

    retrieveAuth() {
        console.log('retrieveAuth not implemented!');
    }

    clearAuth() {
        this.clearCache();
    }

    retrieveCachedAuth() {
        return this.cachedAuth || { accessToken: '' };
    }

    clearCache() {
        this.cachedAuth = {};
    }
}
