import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent } from '@anshuman-gogate-tickets/common'
import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })

  await ticket.save()

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }

  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    // mock fxn so we can track when
    // it was called
    ack: jest.fn(),
  }

  // return all of this stuff
  return { listener, ticket, data, msg }
}

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
  expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message', async () => {
  const { msg, data, listener } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
  const { data, msg, ticket, listener } = await setup()

  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
