import axios from 'axios'

function buildClient({ req }) {
  if (typeof window === 'undefined') {
    // Server

    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    })
  }

  // We are on browser
  return axios.create({
    baseURL: '/'
  })
}

export default buildClient
