import { inputObjectType, AllInputTypes } from '@nexus/schema'

import { AllScalarTypes, AllEnumTypes } from './types'

import { scalarFilterInputName, enumFilterInputName } from './naming'

export interface ScalarFilterBuilderConfig {
  type: AllScalarTypes
  nullable: boolean
}

export const numberFilterBuilder = ({ type, nullable }: ScalarFilterBuilderConfig) => {
  return inputObjectType({
    name: scalarFilterInputName(type, nullable),

    definition(t) {
      t.field('equals', { type })
      t.field('not', { type })

      t.field('lt', { type })
      t.field('lte', { type })
      t.field('gt', { type })
      t.field('gte', { type })

      t.list.field('in', { type })
      t.list.field('notInt', { type })
    },
  })
}

export const booleanFilterBuilder = ({ type, nullable }: ScalarFilterBuilderConfig) => {
  return inputObjectType({
    name: scalarFilterInputName(type, nullable),

    definition(t) {
      t.field('equals', { type })
      t.field('not', { type })

      t.list.field('in', { type })
      t.list.field('notInt', { type })
    },
  })
}

export const stringFilterBuilder = ({ type, nullable }: ScalarFilterBuilderConfig) => {
  return inputObjectType<AllInputTypes>({
    name: scalarFilterInputName(type, nullable),

    definition(t) {
      t.field('equals', { type: 'String' })
      t.field('not', { type: 'String' })
      t.field('startsWith', { type: 'String' })
      t.field('endsWith', { type: 'String' })
      t.field('contains', { type: 'String' })

      t.list.field('in', { type: 'String' })
      t.list.field('notInt', { type: 'String' })
    },
  })
}

// ────────────────────────────────────────────────────────────────────────────────

export interface EnumFilterBuilderConfig {
  type: AllEnumTypes
  nullable: boolean
}

export const enumFilterBuilder = ({ type, nullable }: EnumFilterBuilderConfig) => {
  return inputObjectType({
    name: enumFilterInputName(type, nullable),

    definition(t) {
      t.field('equals', { type })
      t.field('not', { type })

      t.list.field('in', { type })
      t.list.field('notInt', { type })
    },
  })
}
