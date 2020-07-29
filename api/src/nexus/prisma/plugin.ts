/* eslint-disable consistent-return */
import { plugin, dynamicOutputProperty } from '@nexus/schema'
import { printedGenTypingImport } from '@nexus/schema/dist/core'
import { PrismaClient } from '@vats/database'

import { SchemaBuilder } from './builder'

export interface PluginPrismaConfig {
  prisma: PrismaClient
  output: {
    typegen: string
  }
}

export const pluginPrisma = (pluginPrismaConfig: PluginPrismaConfig) => {
  const { prisma } = pluginPrismaConfig
  const builder = new SchemaBuilder(prisma, pluginPrismaConfig)

  return plugin({
    name: 'Prisma',
    fieldDefTypes: [
      printedGenTypingImport({ module: '../prisma/types', bindings: ['PrismaPluginProperty'] }),
    ],
    onInstall() {
      return {
        types: [
          dynamicOutputProperty({
            name: 'custom',
            typeDefinition: `: PrismaPluginProperty<TypeName>`,
            factory: builder.dynamicPropertyFactory.bind(builder),
          }),
        ],
      }
    },

    onBeforeBuild: builder.buildModels.bind(builder),
  })
}
