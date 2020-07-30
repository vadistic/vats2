import { scalarType } from '@nexus/schema'
import type { NexusScalarTypeDef } from '@nexus/schema/dist/core'
import { GraphQLScalarType } from 'graphql'
import { DateTimeResolver, JSONResolver } from 'graphql-scalars'
import { uniq } from 'lodash'

import { ArrayElement } from '../utils/types'

import {
  numberLikeFilterBuilder,
  booleanLikeFilterBuilder,
  stringLikeFilterBuilder,
} from './filter'

export type Scalars = Record<string, GraphQLScalarType>

export const DateTimeScalar = scalarType({
  ...DateTimeResolver,
  name: 'DateTime',
  asNexusMethod: 'dateTime',
  description: ``,
})

export const JSONScalar = scalarType({
  ...JSONResolver,
  name: 'Json',
  asNexusMethod: 'json',
  description: ``,
})

export const prismaScalarNames = ['Json', 'String', 'Int', 'Float', 'DateTime', 'Boolean'] as const
export const graphqlScalarNames = ['ID', 'String', 'Int', 'Float', 'Boolean'] as const

export const buildinScalarNames = uniq([...prismaScalarNames, ...graphqlScalarNames])

export type FilterKind = 'number' | 'string' | 'boolean'

export interface ScalarOptions {
  filterKind: FilterKind
  as?: string | NexusScalarTypeDef<any>
}

export const scalarOptions: Record<ArrayElement<typeof buildinScalarNames>, ScalarOptions> = {
  Boolean: {
    filterKind: 'boolean',
  },
  DateTime: {
    filterKind: 'number',
  },
  Float: {
    filterKind: 'number',
  },
  ID: {
    filterKind: 'boolean',
  },
  Int: {
    filterKind: 'number',
  },
  Json: {
    filterKind: 'boolean',
  },
  String: {
    filterKind: 'string',
  },
}

export const scalarFilterBuilder = (filterKind: FilterKind) =>
  ({
    number: numberLikeFilterBuilder,
    boolean: booleanLikeFilterBuilder,
    string: stringLikeFilterBuilder,
  }[filterKind])
