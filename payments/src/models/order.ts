import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderStatus } from '@anshuman-gogate-tickets/common'

interface OrderAttrs {
  id: string
  status: OrderStatus
  version: number
  userId: string
  price: number
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus
  version: number
  userId: string
  price: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ;(ret.id = ret._id), delete ret._id
      },
    },
  }
)

// concurrency related code
// tells mongoose to use version instead of __v
orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
