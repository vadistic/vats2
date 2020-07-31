import { PluginBuilderLens, enumType } from '@nexus/schema'
import type { NexusEnumTypeDef } from '@nexus/schema/dist/core'

import { Metadata } from '../metadata/metadata'
import type { Config } from '../plugin'
import type { AllEnumTypes } from '../types'

import { buildEnumFilter } from './scalar-filter'

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortDirection = typeof SortDirection[keyof typeof SortDirection]

export const SortDirectionEnum = enumType({
  name: 'SortDirection',
  members: SortDirection,
})

export const addEnums = (
  config: Config,
  metadata: Metadata,
  { addType, hasType }: PluginBuilderLens,
) => {
  const defs: NexusEnumTypeDef<string>[] = []

  if (
    !hasType(SortDirectionEnum.name) &&
    (config.force || metadata.refs.has(SortDirectionEnum.name))
  ) {
    addType(SortDirectionEnum)
    defs.push(SortDirectionEnum)
  }

  metadata.dmmf.datamodel.enums.forEach(en => {
    if (!hasType(en.name) && (config.force || metadata.refs.has(en.name))) {
      const enumDef = enumType({
        name: en.name,
        members: en.values,
      })

      addType(enumDef)
      defs.push(enumDef)
    }
  })

  return defs
}

export const addEnumFilters = (
  config: Config,
  metadata: Metadata,
  { addType, hasType }: PluginBuilderLens,
) => {
  return metadata.dmmf.datamodel.enums
    .flatMap(en => buildEnumFilters(config, en.name))
    .filter(
      enumFilter =>
        !hasType(enumFilter.name) && (config.force || metadata.refs.has(enumFilter.name)),
    )
    .map(enumFilter => {
      addType(enumFilter)

      return enumFilter
    })
}

export const buildEnumFilters = (config: Config, enumName: AllEnumTypes) => {
  const nullableFilter = buildEnumFilter(config, {
    nullable: true,
    type: enumName,
  })

  const nonNullableFilter = buildEnumFilter(config, {
    nullable: false,
    type: enumName,
  })

  return [nullableFilter, nonNullableFilter]
}
