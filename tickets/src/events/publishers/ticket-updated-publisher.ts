import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@anshuman-gogate-tickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
