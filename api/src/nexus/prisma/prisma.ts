/* eslint-disable consistent-return */
import { plugin, dynamicOutputProperty } from '@nexus/schema'
import { CommonOutputFieldConfig, AllOutputTypes } from '@nexus/schema/dist/core'
import { PrismaClient } from '@vats/database'

import { SchemaBuilder } from './builder'

export interface PluginPrismaConfig {
  prisma: PrismaClient
}

export type PrismaPluginFieldConfig<
  TypeName extends string,
  FieldName extends string
> = CommonOutputFieldConfig<TypeName, FieldName> & {
  type?: AllOutputTypes
  alias?: FieldName
}

export const pluginPrisma = (pluginPrismaConfig: PluginPrismaConfig) => {
  const { prisma } = pluginPrismaConfig
  const builder = new SchemaBuilder(prisma)

  return plugin({
    name: 'Prisma',
    onInstall() {
      return {
        types: [
          dynamicOutputProperty({
            name: 'custom',
            typeDefinition: `: NexusPrisma<TypeName, 'model'>`,
            factory: builder.dynamicPropertyFactory.bind(builder),
          }),
        ],
      }
    },

    onBeforeBuild: builder.buildModels.bind(builder),
  })
}
