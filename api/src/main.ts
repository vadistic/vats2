import { log } from '@nexus/logger'
import { ApolloServer } from 'apollo-server'

import { schema } from './nexus/schema'
import { prisma } from './prisma'

const apolloLog = log.child('apollo')

const apolloLogger = {
  debug: (message: string) => apolloLog.debug('debug', { message }),
  error: (message: string) => apolloLog.error('error', { message }),
  info: (message: string) => apolloLog.info('info', { message }),
  warn: (message: string) => apolloLog.warn('warn', { message }),
}

const server = new ApolloServer({
  schema: schema as any,
  playground: true,
  introspection: true,
  uploads: {},
  cors: true,
  logger: apolloLogger,
  context: async () => {
    const [user] = await prisma.user.findMany({
      take: 1,
      select: { id: true, workspaces: { select: { id: true } } },
    })

    return {
      db: prisma,
      log,
      token: user && {
        uid: user.id,
        wid: user.workspaces[0].id,
        roles: ['USER', 'ADMIN'],
      },
    }
  },
})

const port = process.env.PORT || 4000

server.listen({ port }, () =>
  apolloLog.info('start', {
    message: `Server ready at http://localhost:${port}${server.graphqlPath}`,
  }),
)
