export const stripe = {
  charges: {
    // mockResolvedValue ensures that when we
    // call this fxn it creates a promise which
    // automatically resolves itself with an
    // empty object
    create: jest.fn().mockResolvedValue({ id: 'avalidid' }),
  },
}