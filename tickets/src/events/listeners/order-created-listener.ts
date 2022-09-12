import {
  BadRequestError,
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@anshuman-gogate-tickets/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    if (!mongoose.Types.ObjectId.isValid(data.ticket.id)) {
      throw new BadRequestError('Valid ticket id is required')
    }

    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found')
    }

    // Mark the ticket as being reserved by setting
    // its orderId property
    ticket.set({ orderId: data.id })

    // Save the ticket
    await ticket.save()

    // By adding await we ensure that
    // if anything goes wrong with publish
    // then we throw an error here and
    // never reach ack
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })

    // ack the message
    msg.ack()
  }
}
