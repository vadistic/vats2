import { schema } from 'nexus'
import { sel_id } from '../common/check'
import { findOneArgs } from './args'

schema.objectType({
  name: 'UserAccount',
  definition(t) {
    t.implements('Node')

    t.string('email', { nullable: false })
  },
})

schema.objectType({
  name: 'UserProfile',
  definition(t) {
    t.implements('Node')
  },
})

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: 'UserProfile',
      args: findOneArgs,
      resolve: async (root, args, ctx) => {
        const user = await ctx.db.user.findOne({ where: args.where, include: { workspaces: sel_id } })

        if (!user) return null

        const isSameWorkspace = user.workspaces.some((w) => w.id === ctx.token.wid)

        if (!isSameWorkspace || user.deletedAt) {
          return null
        }

        return user
      },
    })

    t.field('account', {
      type: 'UserAccount',
      nullable: true,
      resolve: (root, args, ctx) => {
        return ctx.db.user.findOne({ where: { id: ctx.token.uid } })
      },
    })
  },
})
