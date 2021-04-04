import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

const clientID = randomBytes(4).toString('hex')
const clientIdString = `ticket-listener-${clientID}`

/**
 * Connect to the Nats streaming service
 */
const stan = nats.connect('ticketing', clientIdString, {
  url: 'http://localhost:4222',
})

/**
 * Adding in Queue Groups will balance message delivery across a group of subscribers
 * which can be used to provide application fault tolerance and scale workload processing.
 * Helps so we don't double process an event.
 */
stan.on('connect', () => {
  console.log('Listener connected to Nats: ', clientIdString)

  /**
   * On close kill the client.
   * This is overriding the Nats default process for when 
     clients are killed/closed. Nats would normally wait based on
     params provided when started. (see params in nats-depl.yaml)
   */
  stan.on('close', () => {
    console.log('Closing: ', clientIdString)
    process.exit()
  })

  /**
   * The setManualAckMode(true) option makes it so we have to
   * manually make the acknowledge the we have received the event.
   */
  const options = stan.subscriptionOptions().setManualAckMode(true)

  // The 3rd argument creates the group name.
  const subscription = stan.subscribe(
    'ticket:created',
    'ticket-created-queue-group',
    options,
  )

  subscription.on('message', (messageData: Message) => {
    // Message subject
    console.log(messageData.getSubject())
    // Event number
    console.log(messageData.getSequence())
    // Message Data
    console.log(messageData.getData())

    // We have received the message and processed it.
    // Need to make this call b/c we set .setManualAckMode(true)
    messageData.ack()
  })
})

// Kill the client when its down.
// This prevents the kill delay by NATS
process.on('SIGINT', () => {
  stan.close()
})
process.on('SIGTERM', () => {
  stan.close()
})
