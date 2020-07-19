import { schema, log } from 'nexus'
import { isAuthenticated } from '../rules'

const logger = log.child('candidate')

schema.objectType({
  name: 'Candidate',
  definition(t) {
    t.implements('Node')

    t.string('firstName')
    t.string('lastName')
    t.string('headline')

    t.list.string('emails')
    t.list.string('phones')
    t.list.string('links')
  },
})

schema.inputObjectType({
  name: 'CandidateCreateInput',

  definition(t) {
    t.string('firstName')
    t.string('lastName')
    t.string('headline')

    t.list.string('emails')
    t.list.string('phones')
    t.list.string('links')
  },
})

schema.inputObjectType({
  name: 'CandidateUpdateInput',

  definition(t) {
    t.string('firstName')
    t.string('lastName')
    t.string('headline')

    t.list.string('emails')
    t.list.string('phones')
    t.list.string('links')
  },
})

schema.extendType({
  type: 'Query',

  definition(t) {
    t.field('candidates', {
      type: 'Candidate',
      list: true,
      resolve(root, args, ctx) {
        return ctx.db.candidate.findMany()
      },
    })
  },
})

schema.extendType({
  type: 'Mutation',

  definition(t) {},
})
