import AsyncStorage from '@react-native-community/async-storage';
import Storage from './Storage';

const localStorageKey = 'fanauth';

export default class AsyncStorageAuth extends Storage {
    serialize = JSON.stringify;
    deserialize = JSON.parse;

    refreshCache() {
        return this.retrieveAuth()
            .then((auth) => {
                this.cachedAuth = auth;
                return this.cachedAuth;
            });
    }

    async persistAuth(authPayload) {
        try {
            await AsyncStorage.setItem(localStorageKey, this.serialize(authPayload));
            await this.refreshCache();
            return authPayload;
        } catch (e) {
            return Promise.reject(new Error('Unable to persist auth state to localStorage'));
        }
    }

    async clearAuth() {
        this.clearCache();
        return AsyncStorage.removeItem(localStorageKey);
    }

    async retrieveAuth() {
        try {
            const storedAuthString = await AsyncStorage.getItem(localStorageKey);
            if (storedAuthString) {
                try {
                    return this.deserialize(storedAuthString);
                } catch (e) {
                    console.warn('Error deserializing auth state from localStorage, resetting state...', e);
                    return await AsyncStorage.removeItem(localStorageKey);
                }
            }
        } catch (e) {
            console.log(e);
            return Promise.reject(new Error('Unable to retrieve auth state from localStorage'));
        }
    }
}
