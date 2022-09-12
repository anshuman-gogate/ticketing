import { useState } from 'react'
import axios from 'axios'

function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)

      const { data } = await axios[method](url, {
        ...body,
        ...props,
      })

      if (onSuccess) onSuccess(data)

      return data
    } catch (err) {
      setErrors(
        <div className='alert alert-danger'>
          <ul className='my-0'>
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors }
}

export default useRequest
