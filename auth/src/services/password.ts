import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

// Allows us to use async await
// with callback based functions
const scryptAsync = promisify(scrypt)

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex')

    // as Buffer helps ts to know buf is of type
    // Buffer
    const buf = (await scryptAsync(password, salt, 64)) as Buffer

    return `${buf.toString('hex')}.${salt}`
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.')

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer

    return buf.toString('hex') === hashedPassword
  }
}

// Static methods can be called
// w/o creating a obj of the class
