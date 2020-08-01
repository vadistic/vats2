import { objectType, extendType, arg } from '@nexus/schema'

export const TagModel = objectType({
  name: 'Tag',
  definition(t) {
    t.model.id()
    t.model.createdAt({})
    t.model.updatedAt({})
    t.model.name()
    t.model.description({})

    t.model.candidates()
  },
})

export const TagQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('tags', {
      type: 'Tag',
      list: true,
    })
  },
})
