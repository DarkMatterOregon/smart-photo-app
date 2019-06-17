import _ from './lowLodash';

export default class Observable {
    constructor() {
        this.observers = [];
    }

    subscribe(f) {
        this.observers.push(f);
    }

    unsubscribe(f) {
        this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

    notify({ type, payload }) {
        this.observers.forEach((observer) => {
            if (_.get(observer, 'type', '') === type)   {
                observer(payload);
            }
        });
    }
}
