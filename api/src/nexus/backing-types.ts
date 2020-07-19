import { FieldAuthorizeResolver } from '@nexus/schema'
import {
  RootValue,
  ArgsValue,
  GetGen,
  ResultValue,
  MaybePromiseDeep,
  MaybePromise,
} from '@nexus/schema/dist/typegenTypeHelpers'
import { GraphQLResolveInfo } from 'graphql'

import { IDInput, DeepNonNull, Maybe } from '../types'

import type { NexusGenObjectNames } from './typegen'

// SCALARS

export type DateTime = Date
export type JSON = any
export type URL = string
export type UnsignedFloat = number
export type UnsignedInt = number

// CONTEXT

export interface Context {}

// PAGINATION

export interface PaginationArgs {
  skip?: Maybe<number>
  take?: Maybe<number>
  cursor?: Maybe<IDInput>
}

// AUTO FIELD

export type AutoFieldFindManyArgs<A> = Omit<A, 'where' | 'skip' | 'take' | 'cursor'> & {
  skip?: number
  take?: number
  cursor?: IDInput
  where?: A extends { where?: unknown } ? DeepNonNull<A['where']> : never
}

export type AutoFieldResolver<TypeName extends string, FieldName extends string> = (
  root: RootValue<TypeName>,
  args: ArgsValue<TypeName, FieldName>,
  context: GetGen<'context'>,
  info: GraphQLResolveInfo,
) =>
  | MaybePromise<ResultValue<TypeName, FieldName>>
  | MaybePromiseDeep<ResultValue<TypeName, FieldName>>

export interface AutoFieldConfig<Typename extends string, Fieldname extends string> {
  type: NexusGenObjectNames
  nullable?: boolean
  list?: boolean
  description?: string
  authorize?: FieldAuthorizeResolver<Typename, Fieldname>
  resolve?: AutoFieldResolver<Typename, Fieldname>
}
