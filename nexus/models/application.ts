import { schema } from 'nexus'
import { paginationArgs } from './args'
import { checkFindOne, checkFindMany } from '../common/check'
import { findOneArgs, findManyTransformArgs } from '../common/helper'

schema.interfaceType({
  name: 'Node',
  definition(t) {
    t.id('id')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })

    t.resolveType((node) => {
      return null
    })
  },
})

schema.objectType({
  name: 'Application',
  definition(t) {
    t.implements('Node')
  },
})

schema.inputObjectType({
  name: 'ApplicationCreateInput',

  definition(t) {
    t.list.string('emails')
  },
})

schema.inputObjectType({
  name: 'ApplicationWhereInput',

  definition(t) {
    t.field('id', { type: 'IDFilter' })
    t.field('AND', { type: 'ApplicationWhereInput', list: true })
    t.field('OR', { type: 'ApplicationWhereInput', list: true })
    t.field('NOT', { type: 'ApplicationWhereInput' })
  },
})

schema.inputObjectType({
  name: 'ApplicationFilter',
  definition(t) {
    t.field('every', { type: 'ApplicationWhereInput' })
    t.field('none', { type: 'ApplicationWhereInput' })
    t.field('some', { type: 'ApplicationWhereInput' })
  },
})

schema.inputObjectType({
  name: 'ApplicationOrderByInput',
  definition(t) {
    t.field('id', { type: 'OrderBy' })
    t.field('createdAt', { type: 'OrderBy' })
    t.field('updatedAt', { type: 'OrderBy' })
  },
})

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('application', {
      type: 'Application',
      nullable: true,
      args: findOneArgs,
      async resolve(root, args, ctx) {
        const application = await ctx.db.application.findOne(args)

        return checkFindOne(ctx)(application)
      },
    })

    t.field('applications', {
      type: 'Application',
      list: true,
      args: {
        where: 'ApplicationWhereInput',
        ...paginationArgs,
      },
      resolve(root, args, ctx) {
        return ctx.db.application.findMany(findManyTransformArgs(ctx, args))
      },
    })
  },
})

schema.extendType({
  type: 'Mutation',
  definition(t) {},
})
