import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
// jest will replace it with mock natsWrapper
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'

it('Marks an order as cancelled', async () => {
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100
  })

  await ticket.save()

  const user = global.signin()
  // Make a request to create an order
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make an request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // Expectation to make sure the thing 
  // is cancelled
  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits a order cancelled event', async () => {
  // Create a ticket with Ticket model
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100,
  })

  await ticket.save()

  const user = global.signin()
  // Make a request to create an order
  const { body: order } = await request(app)
    .post(`/api/orders`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // Make an request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})