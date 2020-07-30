import { PluginBuilderLens, enumType } from '@nexus/schema'
import type { NexusEnumTypeDef, NexusInputObjectTypeDef } from '@nexus/schema/dist/core'

import type { Config } from '../plugin'
import type { AllEnumTypes } from '../types'

import type { Dmmf } from './dmmf'
import { enumFilterBuilder } from './scalar-filter'

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortDirection = typeof SortDirection[keyof typeof SortDirection]

export const SortDirectionEnum = enumType({
  name: 'SortDirection',
  members: SortDirection,
})

export const enumBuilder = (
  config: Config,
  dmmf: Dmmf,
  { addType, hasType }: PluginBuilderLens,
) => {
  const enums: NexusEnumTypeDef<string>[] = []
  const inputs: NexusInputObjectTypeDef<string>[] = []

  if (hasType('SortDirection')) {
    addType(SortDirectionEnum)
    enums.push(SortDirectionEnum)
  }

  dmmf.datamodel.enums.forEach(en => {
    if (!hasType(en.name)) {
      const enumDef = enumType({
        name: en.name,
        members: en.values,
      })

      addType(enumDef)
      enums.push(enumDef)
    }

    const nonNulableFilterDef = enumFilterBuilder(config, {
      type: en.name as AllEnumTypes,
      nullable: false,
    })

    const nullableFilterDef = enumFilterBuilder(config, {
      type: en.name as AllEnumTypes,
      nullable: true,
    })

    if (!hasType(nonNulableFilterDef.name)) {
      addType(nonNulableFilterDef)
      inputs.push(nonNulableFilterDef)
    }

    if (!hasType(nullableFilterDef.name)) {
      addType(nullableFilterDef)
      inputs.push(nullableFilterDef)
    }
  })

  return { enums, inputs }
}
