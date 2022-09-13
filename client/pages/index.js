import Link from 'next/link'

// Styles
const containerStyles = {
  marginTop: '1rem',
  color: '#303030',
}

const headingStyles = {
  fontSize: '2.25rem',
  marginBottom: '1.5rem',
}

const tableStyles = {
  maxWidth: '800px',
}

const tHeadStyles = {
  fontSize: '1.25rem',
  textTransform: 'capitalize',
  letterSpacing: '1px',
  color: '#303030 !important',
}

const tBodyStyles = {
  fontSize: '1.125rem',
}

function LandingPage({ currentUser, tickets }) {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  })

  return (
    <div style={containerStyles}>
      <h1 style={headingStyles}>Tickets</h1>

      <table className='table table-striped' style={tableStyles}>
        <thead style={tHeadStyles}>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>

        <tbody style={tBodyStyles}>{ticketList}</tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets')

  return { tickets: data }
}

export default LandingPage
