import { Resolver } from './types'

export const isAuthenticated: Resolver<any> = (root, args, ctx) => {
  return ctx.isAuthenticated
}
