import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const containerStyles = {
  maxWidth: '400px',
  padding: '1rem',
  marginTop: '1rem',
  border: '1px solid #dedede',
  marginLeft: 'auto',
  marginRight: 'auto',
}

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => Router.push('/'),
  })

  const onSubmit = (e) => {
    e.preventDefault()

    doRequest()
  }

  const onBlur = () => {
    const value = parseFloat(price)

    if (isNaN(value)) return

    setPrice(value.toFixed(2))
  }

  return (
    <div style={containerStyles}>
      <h1>Create a ticket</h1>

      <form onSubmit={onSubmit}>
        <div className='form-group mt-3'>
          <label>Title</label>
          <input
            type='text'
            className='form-control'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className='form-group mt-4 mb-3'>
          <label>Price</label>
          <input
            type='number'
            className='form-control'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
          />
        </div>

        {errors}

        <button className='btn btn-dark mt-3 w-100'>Submit</button>
      </form>
    </div>
  )
}

export default NewTicket
