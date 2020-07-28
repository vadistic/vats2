import { makeSchema, nullabilityGuardPlugin } from '@nexus/schema'
import path from 'path'

import * as models from '../model'

import { Role } from './backing-types'
import * as inputs from './inputs'
import { authorizePlugin } from './plugin/authorize'
import { loggerPlugin } from './plugin/logger'
import { rolesPlugin } from './plugin/roles'
import { prisma, pluginPrisma } from './prisma'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as prismagen from './prisma.gen'
import type * as typegen from './type.gen'

const plugins = [
  loggerPlugin({}),
  rolesPlugin<Role>({
    backingType: 'types.Role',
    defaultRole: 'USER',
    getRoles: ctx => undefined,
  }),
  pluginPrisma({
    prisma,
    output: {
      typegen: './src/nexus/prisma.gen.ts',
    },
  }),
  authorizePlugin(),
  nullabilityGuardPlugin({
    shouldGuard: true,
    fallbackValues: {
      String: () => '',
      ID: () => 'MISSING_ID',
      Boolean: () => true,
      DateTime: () => new Date(0),
      URL: () => 'http://example.com',
      Json: () => {},
      UnsignedFloat: () => 0,
      UnsignedInt: () => 0,
      Int: () => 0,
      Float: () => 0,
    },
  }),
]

export const schema = makeSchema({
  types: [inputs, models],
  plugins,
  outputs: {
    schema: path.join(__dirname.replace(/\/dist$/, '/src'), 'schema.gen.graphql'),
    typegen: path.join(__dirname.replace(/\/dist$/, '/src'), 'type.gen.ts'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname.replace(/\/dist$/, '/src'), 'backing-types.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
  },
})
