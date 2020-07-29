import { makeSchema, nullabilityGuardPlugin } from '@nexus/schema'
import path from 'path'

import * as models from '../model'

import { Role } from './backing'
import * as inputs from './common'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as typegen from './generated/nexus'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as prismagen from './generated/prisma'
import { authorizePlugin } from './plugin/authorize'
import { loggerPlugin } from './plugin/logger'
import { rolesPlugin } from './plugin/roles'
import { prisma, pluginPrisma } from './prisma'

const plugins = [
  loggerPlugin({}),
  rolesPlugin<Role>({
    backingType: 'types.Role',
    defaultRole: 'USER',
    getRoles: ctx => ctx.token?.roles,
  }),
  pluginPrisma({
    prisma,
    output: {
      typegen: path.join(__dirname.replace(/\/dist$/, '/src'), 'generated/prisma.ts'),
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
    schema: path.join(__dirname.replace(/\/dist$/, '/src'), 'generated/schema.graphql'),
    typegen: path.join(__dirname.replace(/\/dist$/, '/src'), 'generated/nexus.ts'),
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(__dirname.replace(/\/dist$/, '/src'), 'backing.ts'),
        alias: 'types',
      },
    ],
    contextType: 'types.Context',
  },
})
