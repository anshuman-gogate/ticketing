import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import { OrderCreatedEvent, OrderStatus } from '@anshuman-gogate-tickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  // Create and save an ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  })

  await ticket.save()

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: 'asdf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // Create the fake message object
  // @ts-ignore
  const msg: Message = {
    // mock fxn so we can track
    // when its called
    ack: jest.fn(),
  }

  return { listener, msg, ticket, data }
}

it('sets the orderId of the ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(data.id)
})

it('acks the message', async () => {
  const { data, msg, ticket, listener } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('publishes an ticket updated event', async () => {
  const { data, msg, ticket, listener } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const ticketUpdatedData = JSON.parse(
    // @ts-ignore
    natsWrapper.client.publish.mock.calls[0][1]
  )

  expect(data.id).toEqual(ticketUpdatedData.orderId)
})
