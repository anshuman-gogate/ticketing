import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@anshuman-gogate-tickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
