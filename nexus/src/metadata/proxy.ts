import { PrismaPluginFieldConfig } from '../types'
import { logError } from '../utils/log'
import { noopFn } from '../utils/types'

import { Metadata, FieldMetadata, TypeMetadata } from './metadata'

export interface MetadataProxyCollectProps {
  typeName: string
  modelName?: string
  modelField: string
  arg?: PrismaPluginFieldConfig<string, string, string>
}

export interface MetadataProxyHandlerProps {
  typeName: string
  stage: 'walk' | 'build'
  build?: (fieldMetadata: FieldMetadata, typeMetadata: TypeMetadata) => void
}

export const metadataProxy = (metadata: Metadata) => {
  const collect = ({
    typeName,
    modelName = typeName,
    modelField,
    arg = {},
  }: MetadataProxyCollectProps) => {
    const typeMetadata = metadata.getType(typeName, modelName)
    if (!typeMetadata) return undefined

    const field = typeMetadata.model.fields.find(f => f.name === modelField)

    if (!field) {
      logError(`Field ${modelField} not found in prisma model ${typeMetadata.model.name}`)
      return undefined
    }

    const fieldName = arg.alias || modelField
    const target = arg.type || field.type

    const fieldMetadata: FieldMetadata = {
      fieldName,
      target,
      field,
      arg,
    }

    metadata.addField(typeName, modelName, fieldMetadata)

    return [fieldMetadata, typeMetadata] as const
  }

  const read = ({
    typeName,
    modelName = typeName,
    modelField,
    arg = {},
  }: MetadataProxyCollectProps) => {
    const typeMetadata = metadata.getType(typeName, modelName)
    if (!typeMetadata) return undefined

    const fieldName = arg.alias || modelField
    const fieldMetadata = typeMetadata.fieldMapping[fieldName]

    if (!fieldMetadata) return undefined

    return [fieldMetadata, typeMetadata] as const
  }

  const handler = ({ stage, typeName, build }: MetadataProxyHandlerProps) =>
    new Proxy(noopFn, {
      get(_, key) {
        return (arg?: any) => {
          if (typeof key === 'string') {
            const metadatas = (stage === 'walk' ? collect : read)({
              modelField: key,
              typeName,
              arg,
            })

            if (build && metadatas) build(...metadatas)
          }
        }
      },
      apply(_, thisArg, [modelName]) {
        return new Proxy(
          {},
          {
            get(__, key) {
              return (arg?: any) => {
                if (typeof key === 'string') {
                  const metadatas = (stage === 'walk' ? collect : read)({
                    modelField: key,
                    typeName,
                    arg,
                    modelName,
                  })

                  if (build && metadatas) build(...metadatas)
                }
              }
            },
          },
        )
      },
    })

  return handler
}
