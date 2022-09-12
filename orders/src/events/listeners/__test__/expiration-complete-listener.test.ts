import {
  OrderStatus,
  ExpirationCompleteEvent,
} from '@anshuman-gogate-tickets/common'
import { natsWrapper } from '../../../nats-wrapper'
import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  })
  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, order, data, msg, ticket }
}

it('updates the order status to cancelled', async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emit an orderCancelled event', async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  // [0] => tells what we got on 1st call of this fxn
  // [1] => selects 1 property from the 0th fxn call
  //        which in our case contains data
  //        [0] contains subject name
  // @ts-ignore
  const eventData = JSON.parse(natsWrapper.client.publish.mock.calls[0][1])

  expect(eventData.id).toEqual(order.id)
})

it('acks the message', async () => {
  const { listener, order, ticket, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
