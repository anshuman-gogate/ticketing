import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@anshuman-gogate-tickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
