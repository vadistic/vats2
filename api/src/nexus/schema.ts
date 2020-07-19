import { makeSchema, nullabilityGuardPlugin } from '@nexus/schema'
import path from 'path'

import * as models from '../model'

import { authorizePlugin } from './plugin/authorize'
import { timestampsProperty } from './plugin/timestamps'
import * as scalarFilters from './scalar-filters'
import * as scalars from './scalars'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type * as typegen from './typegen'

const enchancers = [timestampsProperty]

const plugins = [
  authorizePlugin(),
  nullabilityGuardPlugin({
    shouldGuard: true,
    fallbackValues: {
      String: () => '',
      ID: () => 'MISSING_ID',
      Boolean: () => true,
      DateTime: () => new Date(0),
      URL: () => 'http://example.com',
      JSON: () => {},
      UnsignedFloat: () => 0,
      UnsignedInt: () => 0,
      Int: () => 0,
      Float: () => 0,
    },
  }),
]

export const schema = makeSchema({
  types: [enchancers, scalars, scalarFilters, models],
  plugins,
  outputs: {
    schema: path.join(__dirname.replace(/\/dist$/, '/src'), 'schema.graphql'),
    typegen: path.join(__dirname.replace(/\/dist$/, '/src'), 'typegen.ts'),
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
