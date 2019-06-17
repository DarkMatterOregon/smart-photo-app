import Observable from './Observable';

export const refreshPending = 'refreshPending';
export const refreshFailure = 'refreshFailure';
export const refreshSuccess = 'refreshSuccess';

export const logoutPending = 'logoutPending';
export const logoutFailure = 'logoutFailure';
export const logoutSuccess = 'logoutSuccess';

export const updatedToken = 'updatedToken';

let instance;

export default class GuardianEvents extends Observable {
    constructor() {
        if (instance) {
            return instance;
        }
        super();
        instance = this;
        return this;
    }

    sendEvent(type, payload) {
        this.notify({ type, payload });
    }
}
