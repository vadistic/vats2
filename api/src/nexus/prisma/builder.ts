/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import { PluginBuilderLens, AllInputTypes, AllOutputTypes, inputObjectType } from '@nexus/schema'
import { CommonOutputFieldConfig, InputDefinitionBlock, enumType } from '@nexus/schema/dist/core'
import { OutputPropertyFactoryConfig } from '@nexus/schema/dist/dynamicProperty'
import { PrismaClient } from '@vats/database'
import { DmmfTypes, DmmfDocument } from 'nexus-plugin-prisma/dist/schema/dmmf'

import { logError } from '../helper/log-error'
import { enumFilterBuilder } from '../inputs/builder'
import { SortDirectionEnum } from '../inputs/enums'
import {
  scalarFilterInputName,
  whereInputName,
  filterInputName,
  orderByInputName,
} from '../inputs/naming'
import { AllScalarTypes, AllObjectLikeTypes, AllEnumTypes } from '../types'

export type ModelProxyValue = {
  model: DmmfTypes.Model
  typeName: AllObjectLikeTypes
  fields: ModelProxyFieldValue[]
}

export type ModelProxyFieldValue = {
  fieldName: string
  field: DmmfTypes.Field
  config: PrismaPluginFieldConfig<string, string>
}

export type PrismaPluginFieldConfig<
  TypeName extends string,
  FieldName extends string
> = CommonOutputFieldConfig<TypeName, FieldName> & {
  type?: AllOutputTypes
  alias?: FieldName
}

export class SchemaBuilder {
  dmmf: DmmfDocument

  proxies: Record<string, ModelProxyValue> = {}

  constructor(prisma: PrismaClient) {
    this.dmmf = new DmmfDocument((prisma as any).dmmf)
  }

  private _getProxy(typeName: string, customName?: string) {
    if (!this.proxies[typeName]) {
      if (customName && typeof customName !== 'string') {
        logError(`Expected string for custom model name, but got ${customName}`)
        return undefined
      }

      const modelName = customName || typeName

      if (!this.dmmf.hasModel(modelName)) {
        logError(`Model not found in prisma ${modelName}`)
        return undefined
      }

      this.proxies[typeName] = {
        model: this.dmmf.modelsIndex[modelName],
        typeName: typeName as AllObjectLikeTypes,
        fields: [],
      }
    }

    return this.proxies[typeName]
  }

  // ────────────────────────────────────────────────────────────────────────────────

  dynamicPropertyFactory({ typeDef: t, typeName }: OutputPropertyFactoryConfig<string>) {
    const handleGet = (fieldName: any, customName?: any) => {
      const proxy = this._getProxy(typeName, customName)

      if (!proxy) return

      const field = proxy.model.fields.find(f => f.name === fieldName)

      if (!field) {
        logError(`Field ${fieldName} not found in prisma model ${proxy.model.name}`)
        return
      }

      return (config: PrismaPluginFieldConfig<string, string> = {}) => {
        proxy.fields.push({
          fieldName: config.alias || field.name,
          field,
          config,
        })

        t.field(config?.alias || field.name, {
          list: field.isList ? true : undefined,
          nullable: !field.isRequired,
          type: field.name === 'id' ? 'ID' : (field.type as AllOutputTypes),
          ...config,
        })
      }
    }

    return new Proxy(() => {}, {
      get(_, key) {
        return handleGet(key)
      },
      apply(_, thisArg, [args]) {
        return new Proxy(
          {},
          {
            get(__, key) {
              return handleGet(key, args)
            },
          },
        )
      },
    })
  }

  // ─────────────────────────────────────────────────────────────────

  buildModels(lens: PluginBuilderLens) {
    this.buildModelEnums(lens)
    this.buildModelInputs(lens)
  }

  // ────────────────────────────────────────────────────────────────────────────────

  buildFilterField(
    t: InputDefinitionBlock<any>,
    { fieldName, field, config }: ModelProxyFieldValue,
  ) {
    const defaultDescription = `Filter by ${fieldName}`

    if (field.kind === 'enum') {
      t.field(config?.alias || field.name, {
        type: (config?.type || field.type) as AllInputTypes,
        nullable: true,
        description: config?.description || defaultDescription,
      })

      return
    }

    if (field.kind === 'scalar') {
      const defaultScalarFilterType = scalarFilterInputName(
        field.type as AllScalarTypes,
        !field.isRequired,
      )

      t.field(config?.alias || field.name, {
        type: (config?.type || defaultScalarFilterType) as AllInputTypes,
        nullable: true,
        description: config?.description || defaultDescription,
      })

      return
    }

    if (field.kind === 'relation') {
      const defaultScalarFilterType = scalarFilterInputName(
        field.type as AllScalarTypes,
        !field.isRequired,
      )

      t.field(config?.alias || field.name, {
        type: (config?.type || defaultScalarFilterType) as AllInputTypes,
        nullable: true,
        description: config?.description || defaultDescription,
      })
    }

    // TODO: relations
  }

  // ────────────────────────────────────────────────────────────────────────────────

  buildModelEnums({ addType, hasType }: PluginBuilderLens) {
    this.dmmf.datamodel.enums.forEach(en => {
      if (!hasType(en.name)) {
        const enumDef = enumType({
          name: en.name,
          members: en.values,
        })

        addType(enumDef)
      }

      const enumFilter = enumFilterBuilder({
        type: en.name as AllEnumTypes,
        nullable: false,
      })

      const nullableEnumFilter = enumFilterBuilder({
        type: en.name as AllEnumTypes,
        nullable: true,
      })

      addType(enumFilter)
      addType(nullableEnumFilter)
    })
  }

  // ────────────────────────────────────────────────────────────────────────────────

  buildModelInputs({ addType }: PluginBuilderLens) {
    Object.values(this.proxies).forEach(proxy => {
      const whereInput = inputObjectType({
        name: whereInputName(proxy.typeName),
        definition: t => {
          proxy.fields.forEach(fieldValue => {
            this.buildFilterField(t, fieldValue)
          })

          t.field('AND', {
            type: whereInputName(proxy.typeName),
            nullable: true,
            list: true,
            description: ``,
          })

          t.field('OR', {
            type: whereInputName(proxy.typeName),
            nullable: true,
            list: true,
            description: ``,
          })

          t.field('NOT', {
            type: whereInputName(proxy.typeName),
            nullable: true,
            description: ``,
          })
        },
      })

      const filterInput = inputObjectType({
        name: filterInputName(proxy.typeName),
        definition: t => {
          t.field('every', { type: whereInputName(proxy.typeName) })
          t.field('none', { type: whereInputName(proxy.typeName) })
          t.field('some', { type: whereInputName(proxy.typeName) })
        },
      })

      const orderByInput = inputObjectType({
        name: orderByInputName(proxy.typeName),
        definition(t) {
          proxy.fields.forEach(({ fieldName, field }) => {
            if (field.kind === 'scalar' || field.kind === 'enum') {
              t.field(fieldName, {
                nullable: true,
                type: SortDirectionEnum,
              })
            }
          })
        },
      })

      addType(orderByInput)
      addType(filterInput)
      addType(whereInput)
    })
  }
}
