import { DMMF } from '@prisma/client/runtime'

import { TypeMetadata, FieldMetadata } from './metadata'

export const modelToTypeMetadata = (model: DMMF.Model): TypeMetadata => {
  const { fields, fieldMapping } = model.fields.reduce(
    (acc, field) => {
      const fieldMetadata: FieldMetadata = {
        arg: {},
        field,
        fieldName: field.name,
        target: field.type,
      }

      acc.fieldMapping[fieldMetadata.fieldName] = fieldMetadata
      acc.fields.push(fieldMetadata)

      return acc
    },
    { fields: [] as FieldMetadata[], fieldMapping: {} as Record<string, FieldMetadata> },
  )

  return {
    typeName: model.name,
    model,
    fields,
    fieldMapping,
  }
}
