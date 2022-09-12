import nats, { Stan } from 'node-nats-streaming'

// NATS singleton
class NatsWrapper {
  // ? tells TS that the given property
  // might remain undefined for some time
  private _client?: Stan

  // getter in TS
  // it is called like client and not
  // client() 
  get client() {
    if (!this._client) {
      throw new Error('Can not access NATS client before connecting')
    }

    return this._client
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url })

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS')
        resolve()
      })

      this.client.on('error', (err) => {
        reject(err)
      })
    })
  }
}

export const natsWrapper = new NatsWrapper()
