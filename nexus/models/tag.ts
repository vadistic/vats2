import { schema, log } from 'nexus'
import { entity } from '../common/entity'
import { findManyTransformArgs, findOneArgs, findManyArgs } from '../common/helper'
import { TagType } from '@prisma/client'

schema.enumType({ name: 'TagType', members: TagType })

entity({
  name: 'Tag',
  definition(t) {
    t.string('name', { nullable: false })
    t.string('description')

    t.list.field('types', { type: 'TagType' })
  },
})

const resolveFindMany = <A>(modelField: string) => async (
  root: {},
  args: A,
  ctx: NexusContext,
  info: any
) => {
  const res = await (ctx.db as any)[modelField].findMany(findManyTransformArgs(ctx, args))

  return res
}

schema.extendType({
  type: 'Query',
  definition(t) {
    t.field('tag', {
      type: 'Tag',
      args: findOneArgs,
      resolve: (root, args, ctx) => {
        return ctx.db.tag.findOne({ where: {} })
        return null
      },
    })

    t.field('tags', {
      type: 'Tag',
      list: true,
      authorize: () => false,
      args: findManyArgs('Tag'),
      resolve: (root, args, ctx) => {
        return ctx.db.tag.findMany(findManyTransformArgs(ctx, args))
      },
    })
  },
})
