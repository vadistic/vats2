import { objectType, extendType, arg } from '@nexus/schema'

import { findManyTransformArgs, findManyArgs } from '../nexus/common/args'

export const TagModel = objectType({
  name: 'Tag',
  definition(t) {
    t.custom.id()
    t.custom.createdAt({})
    t.custom.updatedAt({})
    t.custom.name()
    t.custom.description({})

    t.custom.candidates()
  },
})

export const TagQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('tags', {
      type: 'Tag',
      list: true,
      args: findManyArgs('Tag'),
      resolve: (_, args, ctx) => {
        return ctx.db.tag.findMany(findManyTransformArgs(ctx, args))
      },
    })
  },
})
