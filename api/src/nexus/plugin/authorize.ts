/* eslint-disable consistent-return */
import { plugin } from '@nexus/schema'
import {
  printedGenTypingImport,
  printedGenTyping,
  RootValue,
  ArgsValue,
  GetGen,
  MaybePromise,
} from '@nexus/schema/dist/core'
import { ForbiddenError } from 'apollo-server'
import { GraphQLResolveInfo } from 'graphql'

import { logError } from '../helper/log-error'

export type AuthorizeResolver<TypeName extends string, FieldName extends string> = (
  root: RootValue<TypeName>,
  args: ArgsValue<TypeName, FieldName>,
  context: GetGen<'context'>,
  info: GraphQLResolveInfo,
) => MaybePromise<undefined | void | string | boolean | Error>

const fieldDefTypes = printedGenTyping({
  optional: true,
  name: 'authorize',
  description: `
    Authorization for an individual field. Returning "undefined"
    or "false" means the field can be accessed.
    Returning "string" or "true"  will respond
    with a error for the field.
    Returning or throwing an error will also prevent the
    resolver from executing.
  `,
  type: 'AuthorizeResolver<TypeName, FieldName>',
  imports: [
    printedGenTypingImport({
      module: '../nexus/plugin/authorize',
      bindings: ['AuthorizeResolver'],
    }),
  ],
})

export interface AuthorizePluginConfig {
  formatError?: (message: string) => Error
}

export const defaultFormatError = (message: string) => new ForbiddenError(message)

export const authorizePlugin = (authConfig: AuthorizePluginConfig = {}) => {
  const { formatError = defaultFormatError } = authConfig

  const getError = (error?: string | Error | Record<string, unknown>) => {
    if (error instanceof Error) {
      return error
    }

    if (typeof error === 'string') {
      return formatError(error)
    }

    if (error && typeof error === 'object' && typeof error.message === 'string') {
      return formatError(error.message)
    }

    return formatError('Unauthorized')
  }

  return plugin({
    name: 'Authorize',
    description: 'The authorize plugin provides field-level authorization for a schema.',
    fieldDefTypes,
    onCreateFieldResolver(config) {
      const authorize = config.fieldConfig.extensions?.nexus?.config.authorize

      // If the field doesn't have an authorize field, don't worry about wrapping the resolver
      if (authorize == null) {
        return
      }

      // If it does have this field, but it's not a function, it's wrong - let's provide a warning
      if (typeof authorize !== 'function') {
        logError(
          `The authorize property provided to ${config.fieldConfig.name}`,
          `with type ${config.fieldConfig.type} should be a function, saw ${typeof authorize}`,
        )

        return
      }

      return (root, args, ctx, info, next) => {
        let toComplete
        try {
          toComplete = authorize(root, args, ctx, info)
        } catch (e) {
          toComplete = Promise.reject(e)
        }

        return plugin.completeValue(
          toComplete,
          result => {
            if (!result) {
              return next(root, args, ctx, info)
            }

            return getError(result)
          },
          err => {
            return getError(err)
          },
        )
      }
    },
  })
}
