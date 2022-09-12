import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  var signin: (id?: string) => string[]
}

// tells jest to mock this file
// we provide the relative path to the
// file we want to mock
jest.mock('../nats-wrapper')

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY='asdf'
  
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  // makes sure that mock functions
  // are reset before each test
  jest.clearAllMocks()

  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo) {
    await mongo.stop()
  }

  await mongoose.connection.close()
})

// signin can take an optional
// argument of id
global.signin = (id?: string) => {
  // Buuild a jwt payload
  // { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session object
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string thats the cookie with
  // encoded data
  return [`session=${base64}`]
}