import { schema, log } from 'nexus'

schema.queryType({
  definition(t) {
    t.boolean('ok', { resolve: () => true })
  },
})

schema.mutationType({
  definition(t) {
    t.boolean('ok', { resolve: () => true })
  },
})

import './models/scalars'
import './models/inputs'

import './models/tag'
import './models/application'
import './models/candidate'
import './models/user'
import './models/workspace'
