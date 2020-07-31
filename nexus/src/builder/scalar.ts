import { PluginBuilderLens } from '@nexus/schema'
import type { NexusScalarTypeDef } from '@nexus/schema/dist/core'

import { Metadata } from '../metadata/metadata'
import type { Config } from '../plugin'
import { AllScalarTypes } from '../types'

import {
  buildinScalarNames,
  scalarOptions,
  getScalarFilterBuilder,
  buildInScalarDefs,
  ScalarOptions,
} from './scalar-config'

export const addScalars = (
  config: Config,
  metadata: Metadata,
  { addType, hasType }: PluginBuilderLens,
) => {
  const defs: NexusScalarTypeDef<string>[] = []

  buildInScalarDefs.forEach(scalar => {
    if (!hasType(scalar.name) && (config.force || metadata.refs.has(scalar.name))) {
      addType(scalar)
      defs.push(scalar)
    }
  })

  return defs
}

export const addScalarFilters = (
  config: Config,
  metadata: Metadata,
  { addType, hasType }: PluginBuilderLens,
) => {
  return buildinScalarNames
    .flatMap(name => buildScalarFilterInputs(config, name))
    .filter(input => !hasType(input.name) && (config.force || metadata.refs.has(input.name)))
    .map(scalarFilter => {
      addType(scalarFilter)

      return scalarFilter
    })
}

export const buildScalarFilterInputs = (config: Config, scalarName: AllScalarTypes) => {
  const options: ScalarOptions = scalarOptions[scalarName] || { filterKind: 'boolean' }

  const type = typeof options.as === 'string' ? options.as : options.as?.value.name ?? scalarName

  const scalarBuilder = getScalarFilterBuilder(options.filterKind)

  const nullableFilter = scalarBuilder(config, {
    nullable: true,
    type,
  })

  const nonNullableFilter = scalarBuilder(config, {
    nullable: false,
    type,
  })

  return [nullableFilter, nonNullableFilter]
}
