import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

// Object matching payload interface
interface Payload {
  orderId: string
}

// name we provide will be the bucket in redis
// where these jobs are stored
// <Payload> tells TS what kind of data
// flows through our queue
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
})

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
})

export { expirationQueue }
