import { PrismaClient } from '@prisma/client'

export class Client extends PrismaClient {}

export const client = new Client({ log: ['query'] })

client.use((params, next) => {
  console.log('params', params)

  return next(params)
})
