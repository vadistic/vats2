import { makeSchema } from '@nexus/schema'
import { isNexusEnumTypeDef, isNexusInputObjectTypeDef } from '@nexus/schema/dist/core'
import { printSchema } from 'graphql'

import { mockBuilderLens, mockConfig } from '../../test/utils'

import { getDmmf } from './dmmf'
import { enumBuilder } from './enum'

describe('enumBuilder', () => {
  const dmmf = getDmmf()
  const lens = mockBuilderLens()
  const config = mockConfig()

  const res = enumBuilder(config, dmmf, lens)

  test('ok', () => {
    expect(res).toBeDefined()

    expect(res.enums.every(isNexusEnumTypeDef)).toBeTruthy()
    expect(res.inputs.every(isNexusInputObjectTypeDef)).toBeTruthy()

    expect(lens.addType).toHaveBeenCalledTimes(res.enums.length + res.inputs.length)
  })

  test('print', () => {
    const schema = makeSchema({ types: res, outputs: false })

    expect(printSchema(schema)).toMatchInlineSnapshot(`
      "enum WorkspaceType {
        FREE
      }

      enum StageType {
        INITIAL
        PROCESS
        REJECT
        SUCCESS
      }

      enum FieldType {
        TEXT
        TEXTAREA
        NUMBER
        SCORE
        BOOLEAN
      }

      enum JobStatus {
        DRAFT
        OPEN
        CLOSED
      }

      enum TagType {
        CANDIDATE
        APPLICATION
        JOB
      }

      input WorkspaceTypeEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: WorkspaceType

        \\"\\"\\"\\"\\"\\"
        not: WorkspaceType

        \\"\\"\\"\\"\\"\\"
        in: [WorkspaceType!]

        \\"\\"\\"\\"\\"\\"
        notInt: [WorkspaceType!]
      }

      input WorkspaceTypeNullableEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: WorkspaceType

        \\"\\"\\"\\"\\"\\"
        not: WorkspaceType

        \\"\\"\\"\\"\\"\\"
        in: [WorkspaceType!]

        \\"\\"\\"\\"\\"\\"
        notInt: [WorkspaceType!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input StageTypeEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: StageType

        \\"\\"\\"\\"\\"\\"
        not: StageType

        \\"\\"\\"\\"\\"\\"
        in: [StageType!]

        \\"\\"\\"\\"\\"\\"
        notInt: [StageType!]
      }

      input StageTypeNullableEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: StageType

        \\"\\"\\"\\"\\"\\"
        not: StageType

        \\"\\"\\"\\"\\"\\"
        in: [StageType!]

        \\"\\"\\"\\"\\"\\"
        notInt: [StageType!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input FieldTypeEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: FieldType

        \\"\\"\\"\\"\\"\\"
        not: FieldType

        \\"\\"\\"\\"\\"\\"
        in: [FieldType!]

        \\"\\"\\"\\"\\"\\"
        notInt: [FieldType!]
      }

      input FieldTypeNullableEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: FieldType

        \\"\\"\\"\\"\\"\\"
        not: FieldType

        \\"\\"\\"\\"\\"\\"
        in: [FieldType!]

        \\"\\"\\"\\"\\"\\"
        notInt: [FieldType!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input JobStatusEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: JobStatus

        \\"\\"\\"\\"\\"\\"
        not: JobStatus

        \\"\\"\\"\\"\\"\\"
        in: [JobStatus!]

        \\"\\"\\"\\"\\"\\"
        notInt: [JobStatus!]
      }

      input JobStatusNullableEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: JobStatus

        \\"\\"\\"\\"\\"\\"
        not: JobStatus

        \\"\\"\\"\\"\\"\\"
        in: [JobStatus!]

        \\"\\"\\"\\"\\"\\"
        notInt: [JobStatus!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      input TagTypeEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: TagType

        \\"\\"\\"\\"\\"\\"
        not: TagType

        \\"\\"\\"\\"\\"\\"
        in: [TagType!]

        \\"\\"\\"\\"\\"\\"
        notInt: [TagType!]
      }

      input TagTypeNullableEnumFilter {
        \\"\\"\\"\\"\\"\\"
        equals: TagType

        \\"\\"\\"\\"\\"\\"
        not: TagType

        \\"\\"\\"\\"\\"\\"
        in: [TagType!]

        \\"\\"\\"\\"\\"\\"
        notInt: [TagType!]

        \\"\\"\\"\\"\\"\\"
        exists: Boolean
      }

      type Query {
        ok: Boolean!
      }
      "
    `)
  })
})
