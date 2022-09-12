import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@anshuman-gogate-tickets/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
