import { plugin, dynamicOutputProperty } from '@nexus/schema'
import { printedGenTypingImport } from '@nexus/schema/dist/core'
import { PrismaClient } from '@prisma/client'

import { addEnums, addEnumFilters } from './builder/enum'
import { addModelInputs } from './builder/model-input'
import { Naming, naming } from './builder/naming'
import { addScalars, addScalarFilters } from './builder/scalar'
import { getDmmf } from './metadata/dmmf'
import { Metadata } from './metadata/metadata'
import { metadataProxy } from './metadata/proxy'

export interface PluginPrismaConfig {
  prisma?: PrismaClient
  output?:
    | boolean
    | {
        typegen: string
      }
  naming?: Partial<Naming>
  force?: boolean
}

export interface Config {
  prisma: PrismaClient
  output:
    | boolean
    | {
        typegen: string
      }
  naming: Naming
  force: boolean
}

export const pluginPrisma = (cfg: PluginPrismaConfig) => {
  const config: Config = {
    ...cfg,
    force: cfg.force ?? false,
    prisma: cfg.prisma ?? new PrismaClient(),
    output: cfg.output === false ? false : cfg.output ?? { typegen: 'src/prisma.generated.ts' },
    naming: {
      ...naming,
      ...cfg.naming,
    },
  }

  const dmmf = getDmmf(config.prisma)
  const metadata = new Metadata(dmmf)

  const proxyHandler = metadataProxy(metadata)

  return plugin({
    name: 'Prisma',
    fieldDefTypes: [
      printedGenTypingImport({ module: '../prisma/types', bindings: ['PrismaPluginProperty'] }),
    ],
    onInstall() {
      return {
        types: [
          dynamicOutputProperty({
            name: 'model',
            typeDefinition: 'any',
            factory: ({ typeName, typeDef: t, stage }) => {
              // TODO: try to runt his only once
              return proxyHandler({
                typeName,
                stage,
                build: ({ fieldName, arg, field }) => {
                  t.field(fieldName, { ...arg, type: arg.type || field.type })
                },
              })
            },
          }),
        ],
      }
    },

    onBeforeBuild: lens => {
      console.log(metadata.refs)
      addScalars(config, metadata, lens)
      addScalarFilters(config, metadata, lens)

      addEnums(config, metadata, lens)
      addEnumFilters(config, metadata, lens)

      addModelInputs(config, metadata, lens)
    },
  })
}
