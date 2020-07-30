import { inputObjectType } from '@nexus/schema'
import type { NexusInputFieldConfig, AllInputTypes } from '@nexus/schema/dist/core'

import { Config } from '../plugin'

import { SortDirectionEnum } from './enum'
import { TypeMetadata, FieldMetadata } from './metadata'

export const modelInputBuilder = (config: Config, typeMetadata: TypeMetadata) => {
  const whereInput = modelWhereInputBuilder(config, typeMetadata)
  const filterInput = modelFilterInputBuilder(config, typeMetadata)
  const orderByInput = modelOrderByInput(config, typeMetadata)

  return [whereInput, filterInput, orderByInput]
}

export const modelWhereInputBuilder = (config: Config, typeMetadata: TypeMetadata) => {
  const whereInputName = config.naming.whereInput(typeMetadata.typeName)

  const whereInput = inputObjectType({
    name: whereInputName,
    definition: t => {
      typeMetadata.fields.forEach(fieldMetadata => {
        const fieldConfig = filterFieldConfig(config, typeMetadata, fieldMetadata)

        if (fieldConfig) {
          t.field(fieldMetadata.fieldName, fieldConfig)
        }
      })

      t.field('AND', {
        type: whereInputName,
        nullable: true,
        list: true,
        description: ``,
      })

      t.field('OR', {
        type: whereInputName,
        nullable: true,
        list: true,
        description: ``,
      })

      t.field('NOT', {
        type: whereInputName,
        nullable: true,
        description: ``,
      })
    },
  })

  return whereInput
}

export const modelFilterInputBuilder = (config: Config, typeMetadata: TypeMetadata) => {
  const filterInputName = config.naming.filterInput(typeMetadata.typeName)
  const whereInputName = config.naming.whereInput(typeMetadata.typeName)

  const filterInput = inputObjectType({
    name: filterInputName,
    definition: t => {
      t.field('every', { type: whereInputName, nullable: true, description: `` })
      t.field('none', { type: whereInputName, nullable: true, description: `` })
      t.field('some', { type: whereInputName, nullable: true, description: `` })
    },
  })

  return filterInput
}

export const modelOrderByInput = (config: Config, typeMetadata: TypeMetadata) => {
  const orderByInputName = config.naming.orderByInput(typeMetadata.typeName)

  const orderByInput = inputObjectType({
    name: orderByInputName,
    definition(t) {
      typeMetadata.fields.forEach(({ fieldName, field }) => {
        if (field.kind === 'scalar' || field.kind === 'enum') {
          t.field(fieldName, {
            nullable: true,
            type: SortDirectionEnum,
          })
        }
      })
    },
  })

  return orderByInput
}

export const filterFieldConfig = (
  { naming }: Config,
  { typeName }: TypeMetadata,
  { fieldName, field, args }: FieldMetadata,
): NexusInputFieldConfig<string, string> | undefined => {
  const description = args?.description ?? `Filter by ${typeName}'s ${fieldName}`

  const type = (args.type || field.type) as AllInputTypes

  if (field.kind === 'enum') {
    const enumFilterInputName = naming.enumFilterInput(type, !field.isRequired)

    return {
      type: enumFilterInputName,
      nullable: true,
      description,
    }
  }

  if (field.kind === 'scalar') {
    const scalarFilterInputName = naming.scalarFilterInput(type, !field.isRequired)

    return {
      type: scalarFilterInputName,
      nullable: true,
      description,
    }
  }

  // TODO: relations
}
