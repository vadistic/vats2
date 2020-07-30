import { makeSchema } from '@nexus/schema'
import { printSchema } from 'graphql'

import { mockBuilderLens, mockConfig } from '../../test/utils'

import { getDmmf } from './dmmf'
import { scalarBuilder } from './scalar'
import { buildinScalarNames } from './scalar-config'

describe('scalarBuilder', () => {
  const dmmf = getDmmf()

  const lens = mockBuilderLens()
  const config = mockConfig()

  const res = scalarBuilder(dmmf, config, lens)

  test('ok', () => {
    expect(res).toBeDefined()
    expect(res.inputs.length).toBe(buildinScalarNames.length * 2)
    expect(res.scalars.length).toBe(2)

    expect(lens.addType).toHaveBeenCalledTimes(res.scalars.length + res.inputs.length)
  })

  test('print', () => {
    const schema = makeSchema({ types: res, outputs: false })

    expect(printSchema(schema)).toMatchInlineSnapshot(`
      "\\"\\"\\"\\"\\"\\"
      scalar DateTime

      \\"\\"\\"\\"\\"\\"
      scalar Json

      input JsonNullableFilter {
        \\"\\"\\"\\"\\"\\"
        equals: Json

        \\"\\"\\"\\"\\"\\"
        not: Json

        \\"\\"\\"\\"\\"\\"
        in: [Json!]

        \\"\\"\\"\\"\\"\\"
        notInt: [Json!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input JsonFilter {
        \\"\\"\\"\\"\\"\\"
        equals: Json

        \\"\\"\\"\\"\\"\\"
        not: Json

        \\"\\"\\"\\"\\"\\"
        in: [Json!]

        \\"\\"\\"\\"\\"\\"
        notInt: [Json!]
      }

      input StringNullableFilter {
        \\"\\"\\"\\"\\"\\"
        equals: String

        \\"\\"\\"\\"\\"\\"
        not: String

        \\"\\"\\"\\"\\"\\"
        startsWith: String

        \\"\\"\\"\\"\\"\\"
        endsWith: String

        \\"\\"\\"\\"\\"\\"
        contains: String

        \\"\\"\\"\\"\\"\\"
        in: [String!]

        \\"\\"\\"\\"\\"\\"
        notInt: [String!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input StringFilter {
        \\"\\"\\"\\"\\"\\"
        equals: String

        \\"\\"\\"\\"\\"\\"
        not: String

        \\"\\"\\"\\"\\"\\"
        startsWith: String

        \\"\\"\\"\\"\\"\\"
        endsWith: String

        \\"\\"\\"\\"\\"\\"
        contains: String

        \\"\\"\\"\\"\\"\\"
        in: [String!]

        \\"\\"\\"\\"\\"\\"
        notInt: [String!]
      }

      input IntNullableFilter {
        \\"\\"\\"\\"\\"\\"
        equals: Int

        \\"\\"\\"\\"\\"\\"
        not: Int

        \\"\\"\\"\\"\\"\\"
        lt: Int

        \\"\\"\\"\\"\\"\\"
        lte: Int

        \\"\\"\\"\\"\\"\\"
        gt: Int

        \\"\\"\\"\\"\\"\\"
        gte: Int

        \\"\\"\\"\\"\\"\\"
        in: [Int!]

        \\"\\"\\"\\"\\"\\"
        notInt: [Int!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input IntFilter {
        \\"\\"\\"\\"\\"\\"
        equals: Int

        \\"\\"\\"\\"\\"\\"
        not: Int

        \\"\\"\\"\\"\\"\\"
        lt: Int

        \\"\\"\\"\\"\\"\\"
        lte: Int

        \\"\\"\\"\\"\\"\\"
        gt: Int

        \\"\\"\\"\\"\\"\\"
        gte: Int

        \\"\\"\\"\\"\\"\\"
        in: [Int!]

        \\"\\"\\"\\"\\"\\"
        notInt: [Int!]
      }

      input FloatNullableFilter {
        \\"\\"\\"\\"\\"\\"
        equals: Float

        \\"\\"\\"\\"\\"\\"
        not: Float

        \\"\\"\\"\\"\\"\\"
        lt: Float

        \\"\\"\\"\\"\\"\\"
        lte: Float

        \\"\\"\\"\\"\\"\\"
        gt: Float

        \\"\\"\\"\\"\\"\\"
        gte: Float

        \\"\\"\\"\\"\\"\\"
        in: [Float!]

        \\"\\"\\"\\"\\"\\"
        notInt: [Float!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input FloatFilter {
        \\"\\"\\"\\"\\"\\"
        equals: Float

        \\"\\"\\"\\"\\"\\"
        not: Float

        \\"\\"\\"\\"\\"\\"
        lt: Float

        \\"\\"\\"\\"\\"\\"
        lte: Float

        \\"\\"\\"\\"\\"\\"
        gt: Float

        \\"\\"\\"\\"\\"\\"
        gte: Float

        \\"\\"\\"\\"\\"\\"
        in: [Float!]

        \\"\\"\\"\\"\\"\\"
        notInt: [Float!]
      }

      input DateTimeNullableFilter {
        \\"\\"\\"\\"\\"\\"
        equals: DateTime

        \\"\\"\\"\\"\\"\\"
        not: DateTime

        \\"\\"\\"\\"\\"\\"
        lt: DateTime

        \\"\\"\\"\\"\\"\\"
        lte: DateTime

        \\"\\"\\"\\"\\"\\"
        gt: DateTime

        \\"\\"\\"\\"\\"\\"
        gte: DateTime

        \\"\\"\\"\\"\\"\\"
        in: [DateTime!]

        \\"\\"\\"\\"\\"\\"
        notInt: [DateTime!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input DateTimeFilter {
        \\"\\"\\"\\"\\"\\"
        equals: DateTime

        \\"\\"\\"\\"\\"\\"
        not: DateTime

        \\"\\"\\"\\"\\"\\"
        lt: DateTime

        \\"\\"\\"\\"\\"\\"
        lte: DateTime

        \\"\\"\\"\\"\\"\\"
        gt: DateTime

        \\"\\"\\"\\"\\"\\"
        gte: DateTime

        \\"\\"\\"\\"\\"\\"
        in: [DateTime!]

        \\"\\"\\"\\"\\"\\"
        notInt: [DateTime!]
      }

      input BooleanNullableFilter {
        \\"\\"\\"\\"\\"\\"
        equals: Boolean

        \\"\\"\\"\\"\\"\\"
        not: Boolean

        \\"\\"\\"\\"\\"\\"
        in: [Boolean!]

        \\"\\"\\"\\"\\"\\"
        notInt: [Boolean!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input BooleanFilter {
        \\"\\"\\"\\"\\"\\"
        equals: Boolean

        \\"\\"\\"\\"\\"\\"
        not: Boolean

        \\"\\"\\"\\"\\"\\"
        in: [Boolean!]

        \\"\\"\\"\\"\\"\\"
        notInt: [Boolean!]
      }

      input IDNullableFilter {
        \\"\\"\\"\\"\\"\\"
        equals: ID

        \\"\\"\\"\\"\\"\\"
        not: ID

        \\"\\"\\"\\"\\"\\"
        in: [ID!]

        \\"\\"\\"\\"\\"\\"
        notInt: [ID!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input IDFilter {
        \\"\\"\\"\\"\\"\\"
        equals: ID

        \\"\\"\\"\\"\\"\\"
        not: ID

        \\"\\"\\"\\"\\"\\"
        in: [ID!]

        \\"\\"\\"\\"\\"\\"
        notInt: [ID!]
      }

      type Query {
        ok: Boolean!
      }
      "
    `)
  })
})
