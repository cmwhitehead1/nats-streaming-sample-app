import nats, { Message } from 'node-nats-streaming'

/**
 * Connect to the Nats streaming service
 */
const stan = nats.connect('ticketing', 'ticket-listener', {
  url: "http://localhost:4222"
})

stan.on('connect', () => {
  console.log('Listener connected to Nats..')

  const subscription = stan.subscribe('ticket:created');
  subscription.on('message', (messageData: Message) => {
    // Message subject
    console.log(messageData.getSubject());
    // Event number
    console.log(messageData.getSequence())
    // Message Data
    console.log(messageData.getData())
  })
})
