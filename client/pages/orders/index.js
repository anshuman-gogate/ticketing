const containerStyles = {
  marginTop: '1rem',
}

const cardContainerStyles = {
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: '1rem',
}

const cardStyles = {
  width: '100%',
  maxWidth: '400px',
  padding: '1rem',
  border: '1px solid #dedede',
  marginTop: '1rem',
  marginBottom: '1rem',
  marginRight: '1.25rem',
}

const Order = ({ orders }) => {
  return (
    <div style={containerStyles}>
      <h1>My Orders</h1>
      <div style={cardContainerStyles}>
        {orders.map((order) => {
          return (
            <div style={cardStyles}>
              <h2>{order.ticket.title}</h2>
              <h4
                style={{
                  color: order.status === 'complete' ? 'green' : order.status === 'created' ? '#FCA510'  : 'red',
                }}
              >
                {order.status}
              </h4>
              <h4>${order.ticket.price}</h4>
            </div>
          )
        })}
      </div>
    </div>
  )
}

Order.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders')

  data.reverse()

  return { orders: data }
}

export default Order
