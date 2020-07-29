import { arg, AllOutputTypes, intArg, idArg } from '@nexus/schema'

import { IDInput, DeepNonNull } from '../../types'
import { cleanDeep } from '../../utils/clean-deep'
import { Context } from '../backing'

import { whereInputName } from './naming'

export const findManyArgs = (type: AllOutputTypes) => ({
  where: arg({
    type: whereInputName(type),
  }),
  skip: intArg(),
  take: intArg({ default: 10 }),
  cursor: idArg(),
})

export type TransformedFindManyArgs<A> = Omit<A, 'where' | 'skip' | 'take' | 'cursor'> & {
  skip?: number
  take?: number
  cursor?: IDInput
  where?: A extends { where?: unknown } ? DeepNonNull<A['where']> : never
}

export const findManyTransformArgs = <A>(ctx: Context, args: A): TransformedFindManyArgs<A> => {
  const res: any = { ...args }

  if ('where' in res) {
    const clean = cleanDeep(res.where) as any

    res.where = { ...clean, wid: ctx.token.wid, deletedAt: null }
  }

  if ('cursor' in res) {
    res.cursor = res.cursor ? { id: res.cursor } : undefined
  }

  if ('take' in res) {
    res.take = res.take ?? undefined
  }

  if ('skip' in res) {
    res.skip = res.skip ?? undefined
  }

  return res
}

//
// ─── FIND ONE ───────────────────────────────────────────────────────────────────
//

export const findOneArgs = {
  id: idArg({
    required: true,
    description: `Node ID`,
  }),
}

export type TransformedFindOneArgs<A> = Omit<A, 'id'> & {
  where?: A extends IDInput ? IDInput : never
}

export const findOneTransformArgs = <A>(ctx: Context, args: A): TransformedFindOneArgs<A> => {
  const res: any = {
    where: { id: (args as any).id },
  }

  return res
}
