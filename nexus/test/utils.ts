/* eslint-disable consistent-return */
import { PluginBuilderLens, plugin, inputObjectType, makeSchema } from '@nexus/schema'
import { PrismaClient } from '@prisma/client'
import { printSchema, print, buildSchema, GraphQLSchema } from 'graphql'

import { naming } from '../src/builder/naming'
import { Config } from '../src/plugin'

export const mockBuilderLens = (): PluginBuilderLens => ({
  addType: jest.fn(),
  hasType: jest.fn(() => false),
  hasConfigOption: jest.fn(() => false),
  getConfigOption: jest.fn(() => undefined),
  setConfigOption: jest.fn(() => {
    /*  */
  }),
})

export const client = new PrismaClient()

export const mockConfig = (): Config => ({
  // TODO: spy?
  prisma: client,
  output: { typegen: './test/tmp/prisma.ts' },
  naming,
})

export const mockMisingPlugin = plugin({
  name: 'MockMissing',
  onMissingType: (typeName, { addType }) => {
    const isInput =
      typeName.includes('Filter') || typeName.includes('Where') || typeName.includes('OrderBy')

    console.log(typeName)

    if (isInput) {
      const input = inputObjectType({
        name: typeName,
        definition(t) {
          t.field('mock', { type: 'Int' })
        },
      })

      addType(input)

      return input
    }
  },
})

export const mockNexus = (types: any) => {
  const schema = makeSchema({
    types,
    outputs: false,
    plugins: [mockMisingPlugin],
  })

  let astSchema: GraphQLSchema

  // parse + print to make schema with ast nodes so they can be printed
  const getSchema = () => {
    if (!astSchema) {
      astSchema = buildSchema(printSchema(schema))
    }

    return astSchema
  }

  return {
    getSchema,
    printSchema: () => printSchema(schema),
    printType: (typeName: string) => {
      const type = getSchema().getType(typeName)

      if (!type || !type.astNode) return 'TYPANAME_NOT_FOUND'

      return print(type.astNode)
    },
  }
}
