import { plugin, dynamicOutputProperty } from '@nexus/schema'
import { printedGenTypingImport } from '@nexus/schema/dist/core'
import { PrismaClient } from '@prisma/client'
import { merge } from 'lodash'

import { addEnums, addEnumFilters } from './builder/enum'
import { addModelInputs } from './builder/model-input'
import { addScalars, addScalarFilters } from './builder/scalar'
import { PluginPrismaConfig, pluginPrismaDefaultConfig, Config } from './config'
import { getDmmf } from './metadata/dmmf'
import { Metadata } from './metadata/metadata'
import { metadataProxy } from './metadata/proxy'

export const pluginPrisma = (prismaPluginConfig: PluginPrismaConfig) => {
  const config: Config = merge(pluginPrismaDefaultConfig, prismaPluginConfig)
  const prisma = prismaPluginConfig.prisma ?? new PrismaClient()

  const dmmf = getDmmf(prisma)
  const metadata = new Metadata(dmmf)

  const proxyHandler = metadataProxy(metadata)

  return plugin({
    name: 'Prisma',
    fieldDefTypes: [
      printedGenTypingImport({ module: '@vats/nexus', bindings: ['PrismaPluginProperty'] }),
    ],
    onInstall() {
      return {
        types: [
          dynamicOutputProperty({
            name: 'model',
            typeDefinition: ': any',
            factory: ({ typeName, typeDef: t, stage }) => {
              // TODO: try to runt his only once
              return proxyHandler({
                typeName,
                stage,
                callback: ({ fieldName, arg, field }) => {
                  t.field(fieldName, { ...arg, type: arg.type || field.type })
                },
              })
            },
          }),
        ],
      }
    },

    onBeforeBuild: lens => {
      addScalars(config, metadata, lens)
      addScalarFilters(config, metadata, lens)

      addEnums(config, metadata, lens)
      addEnumFilters(config, metadata, lens)

      addModelInputs(config, metadata, lens)
    },
  })
}
