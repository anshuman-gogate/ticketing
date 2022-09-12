import {
  BadRequestError,
  Listener,
  OrderCancelledEvent,
  Subjects,
} from '@anshuman-gogate-tickets/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    if (!mongoose.Types.ObjectId.isValid(data.ticket.id)) {
      throw new BadRequestError('Valid ticket id is required')
    }

    const ticket = await Ticket.findById(data.ticket.id)

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    ticket.set({ orderId: undefined })
    await ticket.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version
    })

    msg.ack()
  }
}
