import { PluginBuilderLens } from '@nexus/schema'
import type { NexusInputObjectTypeDef, NexusScalarTypeDef } from '@nexus/schema/dist/core'

import type { Config } from '../plugin'

import { Dmmf } from './dmmf'
import {
  JSONScalar,
  DateTimeScalar,
  buildinScalarNames,
  scalarConfig,
  scalarFilterBuilder,
} from './scalar-config'

/*
 * TODO: support and test custom scalar config
 */
export const scalarBuilder = (
  dmmf: Dmmf,
  _config: Config,
  { addType, hasType }: PluginBuilderLens,
) => {
  const scalars: NexusScalarTypeDef<string>[] = []
  const inputs: NexusInputObjectTypeDef<string>[] = []

  if (!hasType('DateTime')) {
    addType(DateTimeScalar)
    scalars.push(DateTimeScalar)
  }

  if (!hasType('Json')) {
    addType(JSONScalar)
    scalars.push(JSONScalar)
  }

  buildinScalarNames.forEach(scalarName => {
    const config = scalarConfig[scalarName]

    const type = typeof config.as === 'string' ? config.as : config.as?.value.name ?? scalarName

    const nullableFilter = scalarFilterBuilder(config.filterKind)({ nullable: true, type })
    const nonNullableFilter = scalarFilterBuilder(config.filterKind)({ nullable: false, type })

    if (!hasType(nullableFilter.name)) {
      addType(nullableFilter)
      inputs.push(nullableFilter)
    }

    if (!hasType(nonNullableFilter.name)) {
      addType(nonNullableFilter)
      inputs.push(nonNullableFilter)
    }
  })

  return { scalars, inputs }
}
