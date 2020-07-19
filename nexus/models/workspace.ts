import { schema } from 'nexus'

schema.objectType({
  name: 'Workspace',
  definition(t) {
    t.implements('Node')

    t.string('name', { nullable: false })
    t.string('description')
    t.string('website')
  },
})

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('workspace', {
      type: 'Workspace',
      resolve(root, args, ctx) {
        return ctx.db.workspace.findOne({ where: { id: ctx.token.wid } })
      },
    })
  },
})
