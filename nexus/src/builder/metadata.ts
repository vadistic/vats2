import { DMMF } from '@prisma/client/runtime'

import { AllObjectLikeTypes, PrismaPluginFieldConfig } from '../types'

export type TypeMetadata = {
  model: DMMF.Model
  typeName: AllObjectLikeTypes
  fields: FieldMetadata[]
}

export type FieldMetadata = {
  fieldName: string
  field: DMMF.Field
  args: PrismaPluginFieldConfig<string, string, string>
}

export const modelToMetadata = (model: DMMF.Model): TypeMetadata => ({
  typeName: model.name,
  model,
  fields: model.fields.map((field): FieldMetadata => ({ args: {}, field, fieldName: field.name })),
})
