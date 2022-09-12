import 'bootstrap/dist/css/bootstrap.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import buildClient from '../api/build-client'
import Header from '../components/Header'
import Head from 'next/head'

function AppComponent({ Component, pageProps, currentUser }) {
  const [pageTitle, setPageTitle] = useState('Welcome to GitTix')

  const router = useRouter()

  useEffect(() => {
    switch (router.pathname) {
      case '/':
        setPageTitle('Welcome to GitTix')
        break

      case '/auth/signup':
        setPageTitle('Sign up on GitTix')
        break

      case '/auth/signin':
        setPageTitle('Sign in on GitTix')
        break
    }
  }, [router.pathname])

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div>
        <Header currentUser={currentUser} />
        <div
          style={{
            padding: '0 1rem',
            maxWidth: '1300px',
            margin: '0 auto',
          }}
        >
          <Component currentUser={currentUser} {...pageProps} />
        </div>
      </div>
    </>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get('/api/users/currentuser')

  let pageProps = {}

  if (appContext.Component.getInitialProps) {
    // providing client as an argument to the child's
    // getInititalProps so they don't have to build the
    // client each time
    // Similar for currentUser
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    )
  }

  return {
    pageProps,
    ...data,
  }
}

export default AppComponent
