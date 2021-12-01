import PubSub from '../src/PubSub';

// Task2
describe('Test PubSub', () => {
    let pubSub: PubSub;

    beforeEach(()=>{
        pubSub = new PubSub();
    })

    test('test can subscribe and publish', () => {
        let event1Payload = null;
        let event2Payload = null;
        pubSub.subscribe('test-event1', (payload)=>{
            event1Payload = payload;
        });
        pubSub.subscribe('test-event2', (payload)=>{
            event2Payload = payload;
        });
        expect(event1Payload).toBe(null);
        expect(event2Payload).toBe(null);


        pubSub.publish('test-event1', 'this is event 1');
        expect(event1Payload).toBe('this is event 1');
        expect(event2Payload).toBe(null);

        pubSub.publish('test-event2', 'this is event 2');
        expect(event1Payload).toBe('this is event 1');
        expect(event2Payload).toBe('this is event 2');
    });
   
    test('test can unsubscribe', () => {
        let event1Payload = null;
        const token = pubSub.subscribe('test-event1', (payload)=>{
            event1Payload = payload;
        });
        expect(event1Payload).toBe(null);
        pubSub.publish('test-event1', 'this is event 1');
        expect(event1Payload).toBe('this is event 1');

        pubSub.unsubscribe(token,'test-event1');
        pubSub.publish('test-event1', 'this is event 1 - 1');
        expect(event1Payload).toBe('this is event 1');
    });
})