import { schema } from 'nexus'
import { AnyNode, FindManyArgs, Maybe } from '../types'

export const orderByArg = schema.arg({ type: 'OrderBy' })

export const checkFindOne = (ctx: NexusContext) => <N extends AnyNode>(node: Maybe<N>) => {
  if (!node || node.deletedAt || node.wid !== ctx.token.wid) {
    return null
  }

  return node
}

export const checkFindMany = <A extends FindManyArgs>(ctx: NexusContext, args: Maybe<A>) => ({
  ...args,
  where:
    args && args.where
      ? { AND: [{ wid: ctx.token.wid, deletedAt: null }, args.where] }
      : { wid: ctx.token.wid, deletedAt: null },
})

export const sel_id = {
  select: {
    id: true,
  },
} as const
