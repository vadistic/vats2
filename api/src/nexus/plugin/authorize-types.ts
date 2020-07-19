import { RootValue, ArgsValue, GetGen, MaybePromise } from '@nexus/schema/dist/core'
import { GraphQLResolveInfo } from 'graphql'

export type AuthorizeResolver<TypeName extends string, FieldName extends string> = (
  root: RootValue<TypeName>,
  args: ArgsValue<TypeName, FieldName>,
  context: GetGen<'context'>,
  info: GraphQLResolveInfo,
) => MaybePromise<undefined | void | string | boolean | Error>
