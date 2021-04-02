import nats from 'node-nats-streaming'

/**
 * Connect to the Nats streaming service
 */
const stan = nats.connect('ticketing', 'ticket-publisher', {
  url: "http://localhost:4222"
})


/**
 * Once we are connected we will pass the mocked ticket
 * data to the Nats Streaming Service
 */
stan.on('connect', () => {
  console.log('Publisher connected to Nats..')

  // Mocked data for event..
  const ticketData = JSON.stringify({
    id: 23746892736,
    title: 'Breaks not working right',
    description: 'Client complains his breaks are squeaking.'
  });

  // Publish event and data to the NATS streaming service
  stan.publish('ticket:created', ticketData, (err, guid) => {
    console.log(`Published: ${guid} :`, ticketData)
  })
})