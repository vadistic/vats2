import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'

import { schema } from './nexus/schema'

const prisma = new PrismaClient()

const server = new ApolloServer({
  schema: schema as any,
  playground: true,
  introspection: true,
  uploads: {},
  cors: true,
  context: () => {
    return {
      db: prisma,
    }
  },
})

const port = process.env.PORT || 4000

server.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
)
