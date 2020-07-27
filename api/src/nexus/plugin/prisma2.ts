/* eslint-disable class-methods-use-this */
import { plugin, dynamicOutputProperty } from '@nexus/schema'
import {
  printedGenTyping,
  printedGenTypingImport,
  PrintedGenTypingImport,
  PrintedGenTyping,
  StringLike,
  relativePathTo,
} from '@nexus/schema/dist/core'
import { PrismaClient } from '@vats/database'
// eslint-disable-next-line import/no-extraneous-dependencies
import { write } from 'fs-jetpack'
import { DmmfDocument } from 'nexus-plugin-prisma/dist/schema/dmmf'

import { logError } from '../helper/log-error'

export interface PrismaPluginConfig {
  prisma: PrismaClient
  outputs?: {
    typegen: string
  }
}

export const prismaPlugin = (prismaConfig: PrismaPluginConfig) => {
  const { prisma, outputs = { typegen: 'prisma-typegen.ts' } } = prismaConfig
  const dmmf = new DmmfDocument((prisma as any).dmmf)
  const modelNames = Object.keys(dmmf.modelsIndex)

  return plugin({
    name: 'Prisma',
    objectTypeDefTypes: printedGenTyping({
      name: 'model',
      optional: true,
      description: `Describe prisma model to use (if diferent than typename)`,
      type: 'AllModelNames',
      imports: [
        printedGenTypingImport({
          module: '@prisma/client',
          bindings: modelNames,
        }),
        printedGenTypingImport({
          module: relativePathTo(outputs.typegen, 'src/nexus/typegen.ts.ts'),
          bindings: ['AllModelNames', 'PrismaModelMap'],
        }),
        printedGenTypingImport({
          module: './plugin/prisma',
          bindings: ['PrismaModel'],
        }),
      ],
    }),
    onInstall({ getConfigOption }) {
      const shouldGenerateArtifacts =
        getConfigOption('shouldGenerateArtifacts') ?? defaultShouldGenerateArtifacts()

      if (shouldGenerateArtifacts) {
        const typegen = [
          stringifyImport(
            printedGenTypingImport({
              module: '@prisma/client',
              bindings: modelNames,
            }),
          ),
          stringifyInterface({
            name: 'PrismaModelMap',
            fields: modelNames.map(name => `${name}: ${name}`),
          }),
          `export type AllModelNames = '${modelNames.join(`' | '`)}'`,
        ].join('\n\n')

        write(outputs.typegen, typegen)
      }

      return {
        types: [
          dynamicOutputProperty({
            name: 'model',
            typeDefinition: `: PrismaModel<TypeName>`,
            factory: ({ typeDef: t, typeName }) => {
              return new Proxy(
                {},
                {
                  get(target, key) {
                    return (config: any = {}) => {
                      if (typeof key === 'symbol') {
                        logError(`Symbol key? Weird. ${String(key)}`)
                        return
                      }

                      const model = dmmf.modelsIndex[typeName]

                      if (!model) {
                        logError(`Cannot resolve model for type ${typeName}`)
                        return
                      }

                      const field = model.fields.find(f => f.name === key)

                      if (!field) {
                        logError(
                          `Cannot resolve field ${key} on`,
                          typeName === model.name ? typeName : `${typeName} (${model.name})`,
                        )
                        return
                      }

                      const fieldname = config.alias || key
                      const type = config.type || (field.type as any)
                      const description = config.description || `${typeName} ${fieldname} (${type})`

                      t.field(fieldname, { ...config, type, description })
                    }
                  },
                },
              )
            },
          }),
        ],
      }
    },
    onBeforeBuild() {
      // inputObjectType({
      //   name: 'STMH',
      //   definition(t) {
      //     //
      //   },
      // }),

      return {}
    },

    onCreateFieldResolver() {
      return undefined
    },
  })
}
// ────────────────────────────────────────────────────────────────────────────────

export const defaultShouldGenerateArtifacts = () =>
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

// ────────────────────────────────────────────────────────────────────────────────

export interface StringifyInterface {
  name: string
  fields: string | PrintedGenTypingImport | PrintedGenTyping | StringLike[]
}

const stringifyInterface = ({ name, fields }: StringifyInterface) => {
  let res = `export interface ${name} {\n`

  if (Array.isArray(fields)) {
    fields.forEach(field => {
      res += '  ' + field.toString() + '\n'
    })
  } else {
    res += '  ' + fields.toString() + '\n'
  }

  res += '}'

  return res
}

const stringifyImport = ({ config }: PrintedGenTypingImport) => {
  if (config.default) {
    return `import ${config.default} from '${config.module}'`
  }

  if (config.bindings) {
    return `import { ${config.bindings.join(', ')} } from '${config.module}'`
  }
}
