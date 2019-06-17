import firebase from 'firebase';

let instance;

export default class RealtimeManager {
    static REALTIME_UPDATE = 'REALTIME_UPDATE';

    lastEvents = {};

    constructor(eventId) {
        if (instance) {
            return instance;
        }

        this.observers = [];

        const starCountRef = firebase.database().ref(`/${eventId}`);
        starCountRef.on('value', (snapshot) => {
            this.sendEvent(RealtimeManager.REALTIME_UPDATE, snapshot.val());
            this.lastEvents[RealtimeManager.REALTIME_UPDATE] = snapshot.val();
        });

        instance = this;
    }

    getDataForType(type) {
        return this.lastEvents[type] || {};
    }

    subscribe(f) {
        this.observers.push(f);
    }

    unsubscribe(f) {
        this.observers = this.observers.filter(subscriber => subscriber !== f);
    }

    sendEvent(type, payload) {
        this.observers.forEach((observer) => {
            const { type: observerType = '' } = observer;
            if (observerType === type) {
                observer(payload);
            }
        });
    }

    on(type, observer) {
        observer.type = type;
        this.subscribe(observer);
        return observer;
    }
}
