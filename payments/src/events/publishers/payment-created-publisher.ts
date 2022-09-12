import {
  Publisher,
  Subjects,
  PaymentCreatedEvent,
} from '@anshuman-gogate-tickets/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
