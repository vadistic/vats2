import { log } from '@nexus/logger'
import { queryType, mutationType } from '@nexus/schema'

export const Query = queryType({
  definition(t) {
    t.boolean('ok', { resolve: () => true })

    t.boolean('authorizedString', {
      // authorize: (root, args, ctx) => {
      //   log.debug('asd', root)
      // },
      resolve: () => true,
    })

    t.field('auth', {
      type: 'Boolean',
      authorize: (root, args, ctx) => {
        log.debug('authorize args', args)
        return true
      },
      resolve: (root, args, ctx) => {
        log.debug('resolve args', args)

        return true
      },
    })
  },
})

export const Mutation = mutationType({
  definition(t) {
    t.boolean('ok', { resolve: () => true })
  },
})
