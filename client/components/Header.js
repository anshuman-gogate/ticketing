import Link from 'next/link'

const headerStyles = {
  width: '100%',
  maxWidth: '1300px',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.4rem 1rem',
}

function Header({ currentUser }) {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href:'/tickets/new' },
    currentUser && { label: 'My Orders', href:'/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className='nav-item'>
          <Link href={href}>
            <a className='nav-link'>
              <p
                style={{
                  fontSize: '1.25rem',
                  color: '#404040',
                  fontWeight: '500',
                }}
              >
                {label}
              </p>
            </a>
          </Link>
        </li>
      )
    })

  return (
    <nav className='navbar navbar-light bg-light' style={{
      paddingTop: 0
    }}>
      <div
        style={headerStyles}
      >
        <Link href='/'>
          <a className='navbar-brand'>
            <h1>GitTix</h1>
          </a>
        </Link>

        <div className='d-flex justify-content-end'>
          <ul className='nav d-flex align-center mt-2'>{links}</ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
