import express, { Request, Response } from 'express'
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@anshuman-gogate-tickets/common'
import mongoose from 'mongoose'
import { Order, OrderStatus } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new BadRequestError('valid orderId must be provided')
    }

    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    // Publish an event saying this order
    // was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }
