import { useState, useEffect } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

let timerId

const headerStyles = {
  fontSize: '2rem',
  marginTop: '1rem',
  marginBottom: '1rem',
}

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()

    timerId = setInterval(findTimeLeft, 1000)

    return () => clearInterval(timerId)
  }, [order])

  if (timeLeft < 0) {
    clearInterval(timerId)
    return <div>Order Expired</div>
  }

  return (
    <div>
      <div style={headerStyles}>
        <span>Purchasing:</span> <strong>{order.ticket.title}</strong>
      </div>
      <p>Time left to pay: {timeLeft} seconds</p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_51Lf0H7HjCUEeyWZqtCnOkByoap8fB0o3Q6FtoZhnNUsQfWDHPbZhvkvBAu6kpq12tPWpbsogXHWw6GAhusAsmfXY00K9bFPDfc'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
