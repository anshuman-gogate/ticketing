import axios from 'axios'

function buildClient({ req }) {
  if (typeof window === 'undefined') {
    // Server

    // Old base url
    // 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local'

    return axios.create({
      baseURL: 'http://www.anshuman-gogate.online',
      headers: req.headers,
    })
  }

  // We are on browser
  return axios.create({
    baseURL: '/',
  })
}

export default buildClient
