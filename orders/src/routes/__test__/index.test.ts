import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 100,
  })

  await ticket.save()

  return ticket
}

it('fetches orders for a particular user', async () => {
  // Create 3 tickets
  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()

  const userOne = global.signin()
  const userTwo = global.signin()

  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201)

  // Create two orders as User #2
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket2.id })
    .expect(201)

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket3.id })
    .expect(201)

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)

  // Make sure we only got the orders for User #2
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(order1.id)
  expect(response.body[1].id).toEqual(order2.id)
  expect(response.body[0].ticket.id).toEqual(ticket2.id)
  expect(response.body[1].ticket.id).toEqual(ticket3.id)
})