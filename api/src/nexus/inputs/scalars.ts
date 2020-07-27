import { scalarType } from '@nexus/schema'
import { GraphQLScalarType } from 'graphql'
import {
  DateTimeResolver,
  JSONResolver,
  UnsignedIntResolver,
  UnsignedFloatResolver,
  URLResolver,
} from 'graphql-scalars'

export type Scalars = Record<string, GraphQLScalarType>

export const DateTimeScalar = scalarType({
  ...DateTimeResolver,
  name: 'DateTime',
  asNexusMethod: 'dateTime',
  description: `TODO`,
})

export const URLScalar = scalarType({
  ...URLResolver,
  name: 'URL',
  asNexusMethod: 'url',
  description: `TODO`,
})

export const JSONScalar = scalarType({
  ...JSONResolver,
  name: 'Json',
  asNexusMethod: 'json',
  description: `TODO`,
})

export const UnsignedFloatScalar = scalarType({
  ...UnsignedFloatResolver,
  name: 'UnsignedFloat',
  asNexusMethod: 'ufloat',
  description: ``,
})

export const UnsignedIntScalar = scalarType({
  ...UnsignedIntResolver,
  name: 'UnsignedInt',
  asNexusMethod: 'uint',
  description: ``,
})
