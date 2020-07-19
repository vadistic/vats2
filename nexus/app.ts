import app, { settings, schema } from 'nexus'
import { Client, client } from './db/client'
import { JwtToken } from './auth/types'

export const DISABLE_AUTH = process.env.DISABLE_AUTH === 'false'
export const APP_SECRET = process.env.APP_SECRET || 'mySecret'
export const IS_REFLECTION = !!process.env.REFLECTION
export const IS_DEV = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined
export const LOG_LEVEL = IS_DEV ? 'debug' : 'info'
export const PORT = (process.env.port && +process.env.port) || 3000

if (IS_DEV) {
  app.reset()
}

import './schema'

schema.addToContext((req) => {
  return {
    token: {} as JwtToken,
    isAuthenticated: false,
    db: client,
  }
})

settings.change({
  logger: {
    pretty: true,
    filter: {
      level: LOG_LEVEL,
    },
  },
  schema: {
    generateGraphQLSDLFile: IS_DEV && './graphql/schema.graphql',
    nullable: { inputs: true, outputs: true },
    connections: {
      default: {
        includeNodesField: true,
        typePrefix: 'Connection',
        cursorFromNode: (node) => node.id,
        decodeCursor: (id) => id,
        encodeCursor: (id) => id,
      },
    },
  },
  server: {
    path: '/api/graphql',
    playground: {
      path: '/api/playground',
    },
    port: PORT,
  },
})

app.assemble()
