import { plugin } from '@nexus/schema'
import { printedGenTypingImport } from '@nexus/schema/dist/core'
import { PrismaClient } from '@prisma/client'

import { getDmmf } from './builder/dmmf'
import { enumBuilder } from './builder/enum'
import { Naming, naming } from './builder/naming'
import { scalarBuilder } from './builder/scalar'

export interface PluginPrismaConfig {
  prisma?: PrismaClient
  output?: {
    typegen: string
  }
  naming: Partial<Naming>
}

export interface Config {
  prisma: PrismaClient
  output: {
    typegen: string
  }
  naming: Naming
}

export const pluginPrisma = (pluginPrismaConfig: PluginPrismaConfig) => {
  const config: Config = {
    ...pluginPrismaConfig,
    prisma: pluginPrismaConfig.prisma ?? new PrismaClient(),
    output: pluginPrismaConfig.output ?? { typegen: 'src/prisma.generated.ts' },
    naming: {
      ...naming,
      ...pluginPrismaConfig.naming,
    },
  }

  const dmmf = getDmmf(config.prisma)

  return plugin({
    name: 'Prisma',
    fieldDefTypes: [
      printedGenTypingImport({ module: '../prisma/types', bindings: ['PrismaPluginProperty'] }),
    ],
    onInstall() {
      return {
        types: [],
      }
    },

    onBeforeBuild: lens => {
      scalarBuilder(config, dmmf, lens)
      enumBuilder(config, dmmf, lens)
    },
  })
}
