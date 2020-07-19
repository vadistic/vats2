import { GraphQLResolveInfo } from 'graphql'

export type Resolver<Args = any, Result = any, Root = {}> = (
  root: Root,
  args: Args,
  ctx: NexusContext,
  info: GraphQLResolveInfo,
) => Result

export type Maybe<T> = T | undefined | null

export type ID = string

export type IDInput = {
  id: ID
}

export type AnyFilter<T> =
  | T
  | undefined
  | {
      equals?: T
    }

export type AnyNullalbleFilter<T> =
  | T
  | undefined
  | null
  | {
      equals?: T | null
    }

export interface AnyNode {
  id: ID
  wid: ID
  deletedAt: Maybe<Date>
}

export interface WhereInput {
  id?: AnyFilter<ID>
  wid?: AnyFilter<ID>
  deletedAt?: AnyNullalbleFilter<Date>
}

export interface FindManyArgs {
  where?: WhereInput
}

export type NonNull<T> = T extends null ? never : T

type Scalar = string | number | boolean | Date

export type DeepNonNull<T> = T extends Scalar
  ? NonNull<T>
  : T extends Array<any>
  ? _DeepNonNullArray<T[number]>
  : T extends Record<string, unknown>
  ? _DeepNonNullObject<T>
  : NonNull<T>

export interface _DeepNonNullArray<T> extends Array<DeepNonNull<NonNull<T>>> {}

export type _DeepNonNullObject<T> = {
  [P in keyof T]: DeepNonNull<NonNull<T[P]>>
}
