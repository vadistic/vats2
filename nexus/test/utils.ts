import { PluginBuilderLens } from '@nexus/schema'
import { PrismaClient } from '@prisma/client'

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
})
