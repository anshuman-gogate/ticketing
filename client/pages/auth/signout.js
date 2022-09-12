import { useEffect } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

function Signout() {
  const { doRequest, errors } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/')
  })

  useEffect(() => {
    doRequest()
  }, [])

  return (
    <div>signout</div>
  )
}

export default Signout