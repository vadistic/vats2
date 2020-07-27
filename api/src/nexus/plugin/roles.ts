/* eslint-disable consistent-return */
import { plugin } from '@nexus/schema'
import { printedGenTyping, GetGen, CreateFieldResolverInfo } from '@nexus/schema/dist/core'
import { ForbiddenError, AuthenticationError } from 'apollo-server'

import { Maybe } from '../../types'
import { logError } from '../helper/log-error'

export type RolesPluginGetRole<RoleType = string> = (ctx: GetGen<'context'>) => Maybe<RoleType[]>
export type RolesPluginCheckRole<RoleType = string> = (
  provided?: Maybe<RoleType[]>,
  required?: Maybe<RoleType[]>,
) => boolean

export type RolesPluginFormatError<RoleType = string> = (
  provided?: Maybe<RoleType[]>,
  required?: Maybe<RoleType[] | true>,
) => Error

export interface RolesPluginConfig<RoleType = string> {
  formatError?: RolesPluginFormatError<RoleType>
  backingType?: string
  defaultRole?: Maybe<RoleType>
  getRoles?: RolesPluginGetRole<RoleType>
  checkRoles?: RolesPluginCheckRole<RoleType>
}

export const rolesPlugin = <RoleType = string>(roleConfig: RolesPluginConfig<RoleType> = {}) => {
  const {
    formatError = defaultFormatError,
    defaultRole,
    backingType = 'string',
    getRoles = defaultGetRoles,
    checkRoles,
  } = roleConfig

  const fieldDefTypes = printedGenTyping({
    optional: true,
    name: 'roles',
    description: `
      Required  role (Role | Role[]) for an individual field.
      Provide true to pass with any role.
      Provide false to disable role checking.
    `,
    type: `boolean | ${backingType} | ${backingType}[]`,
  })

  return plugin({
    name: 'Role',
    description: 'The role plugin provides field-level role authorization for a schema.',
    fieldDefTypes,
    onCreateFieldResolver(config) {
      const required = getRequiredRoles({ defaultRole }, config)

      // No need to wrap resolvers when no role is required
      if (!required) return

      return (root, args, ctx, info, next) => {
        const provided = getRoles(ctx)

        if (compareRoles({ checkRoles }, provided, required)) {
          return next(root, args, ctx, info)
        }

        return formatError(provided, required)
      }
    },
  })
}

// ────────────────────────────────────────────────────────────────────────────────

export const defaultFormatError = <RoleType = string>(role?: Maybe<RoleType>) => {
  if (!role) {
    return new AuthenticationError('Unathenticated')
  }

  return new ForbiddenError('Insufficient permissions')
}

export const defaultGetRoles = <RoleType = string>(ctx: GetGen<'context'>): Maybe<RoleType> => {
  return (ctx as any).user?.roles
}

const getRequiredRoles = <RoleType = string>(
  { defaultRole }: Pick<RolesPluginConfig<RoleType>, 'defaultRole'>,
  config: CreateFieldResolverInfo<any>,
): true | RoleType[] | undefined => {
  const configRoles = config.fieldConfig.extensions?.nexus?.config.roles

  // Roles are disbled
  if (configRoles === false) {
    return
  }

  // Nullish default role - then provide defalt role on operation fileds
  if (!configRoles) {
    if (!defaultRole) return undefined

    const isOperation = ['Query', 'Mutation', 'Subscription'].includes(config.parentTypeConfig.name)
    return isOperation ? [defaultRole] : undefined
  }

  // Pass through simple true switch
  if (configRoles === true) {
    return true
  }

  // Convert string to string[]
  if (typeof configRoles === 'string') {
    return ([configRoles] as unknown) as RoleType[]
  }

  // Let's make empty roles undefined for nicer api
  if (compareRoles.length === 0) {
    return undefined
  }

  logError(
    `The roles property provided to ${config.fieldConfig.name}`,
    `with type ${config.fieldConfig.type},`,
    `should be a boolean | string | string[], saw ${typeof configRoles}`,
  )
}

const compareRoles = <RoleType = string>(
  { checkRoles }: Pick<RolesPluginConfig<RoleType>, 'checkRoles'>,
  provided: Maybe<RoleType[]>,
  required: RoleType[] | true,
): boolean => {
  // Pass on any role
  if (required === true) {
    return !!provided && provided.length !== 0
  }

  // Pass on eqal match in intersection
  if (provided && required.some(r1 => provided.some(r2 => r1 === r2))) {
    return true
  }

  // Pass on custom checker
  if (checkRoles?.(provided, required)) {
    return true
  }

  return false
}
