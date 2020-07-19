import app from 'nexus'

require('./app')

export const config = {
  helpers: false,
}

export default app.server.handlers.graphql
