import { DMMF } from '@prisma/client/runtime'

import { AllObjectLikeTypes, PrismaPluginFieldConfig } from '../types'
import { logError } from '../utils/log'

import { Dmmf } from './dmmf'

export type TypeMetadata = {
  model: DMMF.Model
  typeName: AllObjectLikeTypes
  fields: FieldMetadata[]
  fieldMapping: Record<string, FieldMetadata>
}

export type FieldMetadata = {
  fieldName: string
  target: string
  field: DMMF.Field
  arg: PrismaPluginFieldConfig<string, string, string>
}

export class Metadata {
  typeMapping: Record<string, TypeMetadata> = {}

  types: TypeMetadata[] = []

  refs: Set<string> = new Set()

  constructor(public dmmf: Dmmf) {}

  getType(typeName: string, modelName: string = typeName): TypeMetadata | undefined {
    if (this.typeMapping[typeName]) {
      return this.typeMapping[typeName]
    }

    if (typeof modelName !== 'string') {
      logError(`Expected string for custom model name, but got ${modelName}`)
      return undefined
    }

    const model = this.dmmf.modelMap[modelName]

    if (!model) {
      logError(`Model ${modelName} not found in prisma dmmf`)
      return undefined
    }

    const typeMetadata: TypeMetadata = {
      model,
      fields: [],
      fieldMapping: {},
      typeName,
    }

    this.typeMapping[typeName] = typeMetadata
    this.types.push(typeMetadata)
    this.refs.add(typeName)

    return typeMetadata
  }

  addType(typeMetadata: TypeMetadata): TypeMetadata | undefined {
    const prev = this.getType(typeMetadata.typeName, typeMetadata.model.name)

    if (!prev) return undefined

    Object.assign(prev, typeMetadata)

    return typeMetadata
  }

  getField(typeName: string, fieldName: string): FieldMetadata | undefined {
    const typeMetadata = this.getType(typeName)
    if (!typeMetadata) return undefined

    return typeMetadata.fieldMapping[fieldName]
  }

  addField(
    typeName: string,
    modelName: string = typeName,
    fieldMetadata: FieldMetadata,
  ): FieldMetadata | undefined {
    const typeMetadata = this.getType(typeName, modelName)
    if (!typeMetadata) return undefined

    typeMetadata.fields.push(fieldMetadata)
    typeMetadata.fieldMapping[fieldMetadata.fieldName] = fieldMetadata

    this.refs.add(fieldMetadata.target)

    return fieldMetadata
  }
}
