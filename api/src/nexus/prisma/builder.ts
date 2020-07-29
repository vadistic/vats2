/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import { PluginBuilderLens, AllInputTypes, AllOutputTypes, inputObjectType } from '@nexus/schema'
import { CommonOutputFieldConfig, InputDefinitionBlock, enumType } from '@nexus/schema/dist/core'
import { OutputPropertyFactoryConfig } from '@nexus/schema/dist/dynamicProperty'
import { PrismaClient } from '@vats/database'
// eslint-disable-next-line import/no-extraneous-dependencies
import { write } from 'fs-jetpack'
import { DmmfTypes, DmmfDocument } from 'nexus-plugin-prisma/dist/schema/dmmf'

import { SortDirectionEnum } from '../common/enums'
import {
  scalarFilterInputName,
  whereInputName,
  filterInputName,
  orderByInputName,
} from '../common/naming'
import { enumFilterBuilder } from '../common/scalar-filter-builders'
import { AllScalarTypes, AllObjectLikeTypes, AllEnumTypes } from '../common/types'
import { logError } from '../helper/log-error'

import type { PluginPrismaConfig } from './plugin'
import { printInterface, printGlobal, printImport } from './print'

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

  constructor(prisma: PrismaClient, readonly config: PluginPrismaConfig) {
    this.dmmf = new DmmfDocument((prisma as any).dmmf)
  }

  private _getProxy(typeName: string, modelName: string = typeName) {
    if (!this.proxies[typeName]) {
      if (modelName && typeof modelName !== 'string') {
        logError(`Expected string for custom model name, but got ${modelName}`)
        return undefined
      }

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
    const handleGet = (modelField: string, modelName?: string) => {
      const proxy = this._getProxy(typeName, modelName)

      if (!proxy) return

      const field = proxy.model.fields.find(f => f.name === modelField)

      if (!field) {
        logError(`Field ${modelField} not found in prisma model ${proxy.model.name}`)
        return
      }

      return (config: PrismaPluginFieldConfig<string, string> = {}) => {
        const fieldName = config.alias || field.name

        proxy.fields.push({
          fieldName,
          field,
          config,
        })

        t.field(fieldName, {
          list: field.isList ? true : undefined,
          nullable: !field.isRequired,
          type: field.name === 'id' ? 'ID' : (field.type as AllOutputTypes),
          ...config,
        })
      }
    }

    return new Proxy(() => {}, {
      get(_, key) {
        if (typeof key === 'string') {
          return handleGet(key)
        }
      },
      apply(_, thisArg, [args]) {
        return new Proxy(
          {},
          {
            get(__, key) {
              if (typeof key === 'string') {
                return handleGet(key, args)
              }
            },
          },
        )
      },
    })
  }

  // ────────────────────────────────────────────────────────────────────────────────

  typegenImports() {
    return printImport({ module: '@prisma/client', default: '* as Prisma' })
  }

  typegenPrismaOutputs() {
    const outputFields: string[] = this.dmmf.datamodel.models.map(
      model =>
        `${model.name}: {\n    ${model.fields
          .map(f => `${f.name}: '${f.type}'`)
          .join('\n    ')}\n  }`,
    )

    return printInterface({ name: 'PrismaOutputs', fields: outputFields })
  }

  typegenPrismaModels() {
    const modelFields: string[] = this.dmmf.datamodel.models.map(
      model => `${model.name}: Prisma.${model.name}`,
    )

    return printInterface({ name: 'PrismaModels', fields: modelFields })
  }

  typegenPrismaGen() {
    return printInterface({
      name: 'PrismaGen',
      fields: [`outputs: PrismaOutputs`, `models: PrismaModels`],
    })
  }

  typegen() {
    const result = [
      this.typegenImports(),
      this.typegenPrismaModels(),
      this.typegenPrismaOutputs(),
      printGlobal(this.typegenPrismaGen()),
    ].join('\n\n')

    write(this.config.output.typegen, result)
  }

  // ─────────────────────────────────────────────────────────────────

  buildModels(lens: PluginBuilderLens) {
    this.buildModelEnums(lens)
    this.buildModelInputs(lens)

    if (this.shouldGenerateArtifacts()) {
      this.typegen()
    }
  }

  shouldGenerateArtifacts() {
    const nodeEnv = process.env.NODE_ENV

    return !nodeEnv || nodeEnv === 'development'
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

      t.field(fieldName, {
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

      t.field(fieldName, {
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

      addType(whereInput)

      const filterInput = inputObjectType({
        name: filterInputName(proxy.typeName),
        definition: t => {
          t.field('every', { type: whereInputName(proxy.typeName) })
          t.field('none', { type: whereInputName(proxy.typeName) })
          t.field('some', { type: whereInputName(proxy.typeName) })
        },
      })

      addType(filterInput)

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
    })
  }
}
