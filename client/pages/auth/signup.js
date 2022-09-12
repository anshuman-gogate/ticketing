import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => {
      setEmail('')
      setPassword('')
      Router.push('/')
    },
  })

  const onSubmit = async (event) => {
    event.preventDefault()

    doRequest()
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '1.5rem auto',
        padding: '2rem 1.5rem',
        border: '1px solid #dedede',
      }}
    >
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>

        <div className='form-group mt-3'>
          <label>Email Address</label>
          <input
            className='form-control'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='form-group mt-3 mb-2'>
          <label>Password</label>
          <input
            type='password'
            className='form-control'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errors}

        <button className='btn btn-dark mt-4 w-100'>Sign Up</button>
      </form>
    </div>
  )
}

export default Signup
