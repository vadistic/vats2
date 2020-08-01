import { PrismaClient } from '@prisma/client'

import { Naming, naming } from './builder/naming'
import { AllScalarTypes } from './types'

export interface PluginPrismaConfig {
  prisma?: PrismaClient
  output?:
    | boolean
    | {
        typegen: string
      }
  naming?: Partial<Naming>
  force?: boolean

  pagination?: {
    take?: {
      default?: number
      limit?: number
    }
  }

  idType?: 'String' | 'Int' | 'ID' | AllScalarTypes
}

export interface Config {
  prisma?: PrismaClient
  output:
    | boolean
    | {
        typegen: string
      }
  naming: Naming
  force: boolean

  pagination: {
    take: {
      default: number
      limit: number
    }
  }
  idType: 'String' | 'Int' | 'ID' | AllScalarTypes
}

export const pluginPrismaDefaultConfig: Config = {
  force: false,
  naming,
  output: { typegen: './src/prismagen.ts' },
  pagination: {
    take: { default: 25, limit: 100 },
  },
  idType: 'ID',
}
