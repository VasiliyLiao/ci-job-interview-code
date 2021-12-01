import SubscriberCallback from './subscriber_cb';
import { v4 as uuid } from 'uuid';

class PubSub {
    // Map<eventName, Map<token, subscriber>>
    subscribers : Map<string, Map<string, SubscriberCallback>> = new Map;
  
    protected getEventSubscribers(eventName: string) {
        let subscriber = this.subscribers.get(eventName);
        return subscriber;    
    }

    protected autoInitEventSubscribers(eventName: string) {
        if (!this.getEventSubscribers(eventName)) {
            this.subscribers.set(eventName, new Map);
        }
    }

    // Class must provide a method to listen (subscribe) to events;
    subscribe(eventName: string, subscriber: SubscriberCallback): string {
        const token = uuid();
        this.autoInitEventSubscribers(eventName);
        let eventSubscribers = this.getEventSubscribers(eventName);
        if (!eventSubscribers) {
            // fool‑proof design
            throw new Error('has event subscriber not exist');
        }

        eventSubscribers.set(token, subscriber);
        return token;
    }

    // Class also provides a method to unsubscribe to events;
    // combine key
    unsubscribe(token: string, eventName: string){
        const eventSubscribers = this.getEventSubscribers(eventName);
        if (!eventSubscribers) {
            throw new Error('not found event subscriber');
        }
        if (!eventSubscribers.get(token)) {
            throw new Error('not found event subscriber');
        }
        eventSubscribers.delete(token);
    }
  
    // Class must provide a method to publish events
    publish(eventName: string, payload: any): boolean {
        this.autoInitEventSubscribers(eventName);
        const eventSubscribers = this.getEventSubscribers(eventName);
        if (eventSubscribers) {
            eventSubscribers.forEach(eventSubscriber => eventSubscriber(payload));
            return true;
        }

        return false;
    }

  }

  export default PubSub;