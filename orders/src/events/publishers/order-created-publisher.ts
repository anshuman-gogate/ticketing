import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@anshuman-gogate-tickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}