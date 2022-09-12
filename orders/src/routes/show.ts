import express, { Request, Response } from 'express'
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@anshuman-gogate-tickets/common'
import { Order } from '../models/order'
import mongoose from 'mongoose'

const router = express.Router()

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      throw new BadRequestError('valid orderId must be provided')
    }

    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      // we might want to change it to
      // not found error
      throw new NotAuthorizedError()
    }

    res.send(order)
  }
)

export { router as showOrderRouter }
