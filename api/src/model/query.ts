import { queryType, mutationType } from '@nexus/schema'

export const Query = queryType({
  definition(t) {
    t.boolean('ok', { resolve: () => true })

    t.field('auth', {
      type: 'Boolean',
      authorize: (root, args, ctx) => {},
      roles: false,
      resolve: (root, args, ctx) => {
        return true
      },
    })

    t.field('tag', {
      type: 'Tag',
      nullable: true,
      resolve: () => {
        return null
      },
    })
  },
})

export const Mutation = mutationType({
  definition(t) {
    t.boolean('ok', { resolve: () => true })
  },
})
