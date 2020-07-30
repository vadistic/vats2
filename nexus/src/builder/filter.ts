import { inputObjectType, AllInputTypes } from '@nexus/schema'

import { AllScalarTypes, AllEnumTypes } from '../types'

import { scalarFilterInputName, enumFilterInputName } from './naming'

export interface ScalarFilterBuilderConfig {
  type: AllScalarTypes
  nullable: boolean
}

export const numberLikeFilterBuilder = ({ type, nullable }: ScalarFilterBuilderConfig) => {
  return inputObjectType({
    name: scalarFilterInputName(type, nullable),

    definition(t) {
      t.field('equals', { type, nullable: true, description: `` })
      t.field('not', { type, nullable: true, description: `` })

      t.field('lt', { type, nullable: true, description: `` })
      t.field('lte', { type, nullable: true, description: `` })
      t.field('gt', { type, nullable: true, description: `` })
      t.field('gte', { type, nullable: true, description: `` })

      t.list.field('in', { type, nullable: true, description: `` })
      t.list.field('notInt', { type, nullable: true, description: `` })

      if (nullable) {
        t.boolean('exists', { nullable: true, description: `` })
      }
    },
  })
}

export const booleanLikeFilterBuilder = ({ type, nullable }: ScalarFilterBuilderConfig) => {
  return inputObjectType({
    name: scalarFilterInputName(type, nullable),

    definition(t) {
      t.field('equals', { type, nullable: true, description: `` })
      t.field('not', { type, nullable: true, description: `` })

      t.list.field('in', { type, nullable: true, description: `` })
      t.list.field('notInt', { type, nullable: true, description: `` })

      if (nullable) {
        t.boolean('exists', { nullable: true, description: `` })
      }
    },
  })
}

export const stringLikeFilterBuilder = ({ type, nullable }: ScalarFilterBuilderConfig) => {
  return inputObjectType<AllInputTypes>({
    name: scalarFilterInputName(type, nullable),

    definition(t) {
      t.field('equals', { type, nullable: true, description: `` })
      t.field('not', { type, nullable: true, description: `` })
      t.field('startsWith', { type, nullable: true, description: `` })
      t.field('endsWith', { type, nullable: true, description: `` })
      t.field('contains', { type, nullable: true, description: `` })

      t.list.field('in', { type, nullable: true, description: `` })
      t.list.field('notInt', { type, nullable: true, description: `` })

      if (nullable) {
        t.boolean('exists', { nullable: true, description: `` })
      }
    },
  })
}

export interface EnumFilterBuilderConfig {
  type: AllEnumTypes
  nullable: boolean
}

export const enumFilterBuilder = ({ type, nullable }: EnumFilterBuilderConfig) => {
  return inputObjectType({
    name: enumFilterInputName(type, nullable),

    definition(t) {
      t.field('equals', { type, nullable: true, description: `` })
      t.field('not', { type, nullable: true, description: `` })

      t.list.field('in', { type, nullable: true, description: `` })
      t.list.field('notInt', { type, nullable: true, description: `` })

      if (nullable) {
        t.boolean('exists', { nullable: true, description: `` })
      }
    },
  })
}
