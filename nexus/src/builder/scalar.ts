import { PluginBuilderLens } from '@nexus/schema'
import type { NexusInputObjectTypeDef, NexusScalarTypeDef } from '@nexus/schema/dist/core'

import type { Config } from '../plugin'

import { Dmmf } from './dmmf'
import {
  JSONScalar,
  DateTimeScalar,
  buildinScalarNames,
  scalarOptions,
  scalarFilterBuilder,
} from './scalar-config'

/*
 * TODO: support and test custom scalar config
 */
export const scalarBuilder = (
  config: Config,
  dmmf: Dmmf,
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
    const options = scalarOptions[scalarName]

    const type = typeof options.as === 'string' ? options.as : options.as?.value.name ?? scalarName

    const nullableFilter = scalarFilterBuilder(options.filterKind)(config, { nullable: true, type })
    const nonNullableFilter = scalarFilterBuilder(options.filterKind)(config, {
      nullable: false,
      type,
    })

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
