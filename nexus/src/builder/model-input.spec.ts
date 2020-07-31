import { testkConfig, testNexus } from '../../test/utils'
import { modelToTypeMetadata } from '../metadata/convert'
import { getDmmf } from '../metadata/dmmf'

import { modelOrderByInput, modelFilterInputBuilder, modelWhereInputBuilder } from './model-input'

describe('model inputs', () => {
  const config = testkConfig()
  const dmmf = getDmmf()

  const tagMetadata = modelToTypeMetadata(dmmf.modelMap['Tag'])

  const whereInput = modelWhereInputBuilder(config, tagMetadata)
  const filterInput = modelFilterInputBuilder(config, tagMetadata)
  const orderByInput = modelOrderByInput(config, tagMetadata)

  const nexus = testNexus([whereInput, filterInput, orderByInput])

  test('ok', () => {
    expect(whereInput).toBeDefined()
    expect(filterInput).toBeDefined()
    expect(orderByInput).toBeDefined()
  })

  test('print where input', () => {
    expect(nexus.printType('TagWhere')).toMatchInlineSnapshot(`
      "input TagWhere {
        \\"\\"\\"Filter by Tag's id\\"\\"\\"
        id: StringFilter
        \\"\\"\\"Filter by Tag's wid\\"\\"\\"
        wid: StringFilter
        \\"\\"\\"Filter by Tag's node\\"\\"\\"
        node: NodeWhere
        \\"\\"\\"Filter by Tag's workspace\\"\\"\\"
        workspace: WorkspaceWhere
        \\"\\"\\"Filter by Tag's createdAt\\"\\"\\"
        createdAt: DateTimeFilter
        \\"\\"\\"Filter by Tag's updatedAt\\"\\"\\"
        updatedAt: DateTimeFilter
        \\"\\"\\"Filter by Tag's deletedAt\\"\\"\\"
        deletedAt: DateTimeNullableFilter
        \\"\\"\\"Filter by Tag's name\\"\\"\\"
        name: StringFilter
        \\"\\"\\"Filter by Tag's description\\"\\"\\"
        description: StringNullableFilter
        \\"\\"\\"Filter by Tag's types\\"\\"\\"
        types: TagTypeNullableEnumFilter
        \\"\\"\\"Filter by Tag's candidates\\"\\"\\"
        candidates: CandidateFilter
        \\"\\"\\"\\"\\"\\"
        AND: [TagWhere!]
        \\"\\"\\"\\"\\"\\"
        OR: [TagWhere!]
        \\"\\"\\"\\"\\"\\"
        NOT: TagWhere
      }"
    `)
  })

  test('print orderby input', () => {
    expect(nexus.printType('TagOrderBy')).toMatchInlineSnapshot(`
      "input TagOrderBy {
        id: SortDirection
        wid: SortDirection
        createdAt: SortDirection
        updatedAt: SortDirection
        deletedAt: SortDirection
        name: SortDirection
        description: SortDirection
        types: SortDirection
      }"
    `)
  })

  test('print filter input', () => {
    expect(nexus.printType('TagFilter')).toMatchInlineSnapshot(`
      "input TagFilter {
        \\"\\"\\"\\"\\"\\"
        every: TagWhere
        \\"\\"\\"\\"\\"\\"
        none: TagWhere
        \\"\\"\\"\\"\\"\\"
        some: TagWhere
      }"
    `)
  })
})
