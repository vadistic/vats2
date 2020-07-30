import { plugin } from '@nexus/schema'
import { printedGenTypingImport } from '@nexus/schema/dist/core'
import { PrismaClient } from '@prisma/client'

import { getDmmf } from './builder/dmmf'
import { enumBuilder } from './builder/enum'
import { scalarBuilder } from './builder/scalar'

export interface PluginPrismaConfig {
  prisma?: PrismaClient
  output?: {
    typegen: string
  }
}

export interface Config {
  prisma: PrismaClient
  output: {
    typegen: string
  }
}

export const pluginPrisma = (pluginPrismaConfig: PluginPrismaConfig) => {
  const config: Config = {
    ...pluginPrismaConfig,
    prisma: pluginPrismaConfig.prisma ?? new PrismaClient(),
    output: pluginPrismaConfig.output ?? { typegen: 'src/prisma.generated.ts' },
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
      scalarBuilder(dmmf, config, lens)
      enumBuilder(dmmf, config, lens)
    },
  })
}
