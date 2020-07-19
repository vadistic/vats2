import { schema } from 'nexus'

schema.inputObjectType({
  name: 'IDInput',
  definition(t) {
    t.id('id', { required: true })
  },
})

schema.enumType({
  name: 'OrderBy',
  members: [{ name: 'desc' }, { name: 'asc' }],
})

// ────────────────────────────────────────────────────────────────────────────────

schema.inputObjectType({
  name: 'IDFilter',

  definition(t) {
    t.field('equals', { type: 'ID' })
    t.field('not', { type: 'ID' })

    t.list.field('in', { type: 'ID' })
    t.list.field('notInt', { type: 'ID' })
  },
})

schema.inputObjectType({
  name: 'NullableIDFilter',

  definition(t) {
    t.field('equals', { type: 'ID' })
    t.field('not', { type: 'ID' })

    t.list.field('in', { type: 'ID' })
    t.list.field('notInt', { type: 'ID' })
  },
})

schema.inputObjectType({
  name: 'BooleanFilter',

  definition(t) {
    t.field('equals', { type: 'Boolean' })
    t.field('not', { type: 'Boolean' })

    t.list.field('in', { type: 'Boolean' })
    t.list.field('notInt', { type: 'Boolean' })
  },
})

schema.inputObjectType({
  name: 'NullableBooleanFilter',

  definition(t) {
    t.field('equals', { type: 'Boolean' })
    t.field('not', { type: 'Boolean' })

    t.list.field('in', { type: 'Boolean' })
    t.list.field('notInt', { type: 'Boolean' })
  },
})

schema.inputObjectType({
  name: 'StringFilter',

  definition(t) {
    t.field('equals', { type: 'String' })
    t.field('not', { type: 'String' })

    t.field('startsWith', { type: 'String' })
    t.field('endsWith', { type: 'String' })
    t.field('contains', { type: 'String' })

    t.list.field('in', { type: 'String' })
    t.list.field('notInt', { type: 'String' })
  },
})

schema.inputObjectType({
  name: 'NullableStringFilter',

  definition(t) {
    t.field('equals', { type: 'String' })
    t.field('not', { type: 'String' })

    t.field('startsWith', { type: 'String' })
    t.field('endsWith', { type: 'String' })
    t.field('contains', { type: 'String' })

    t.list.field('in', { type: 'String' })
    t.list.field('notInt', { type: 'String' })
  },
})

schema.inputObjectType({
  name: 'DateTimeFilter',

  definition(t) {
    t.field('equals', { type: 'DateTime' })
    t.field('not', { type: 'DateTime' })

    t.field('lt', { type: 'DateTime' })
    t.field('lte', { type: 'DateTime' })
    t.field('gt', { type: 'DateTime' })
    t.field('gte', { type: 'DateTime' })

    t.list.field('in', { type: 'DateTime' })
    t.list.field('notInt', { type: 'DateTime' })
  },
})

schema.inputObjectType({
  name: 'NullableDateTimeFilter',

  definition(t) {
    t.field('equals', { type: 'DateTime' })
    t.field('not', { type: 'DateTime' })

    t.field('lt', { type: 'DateTime' })
    t.field('lte', { type: 'DateTime' })
    t.field('gt', { type: 'DateTime' })
    t.field('gte', { type: 'DateTime' })

    t.list.field('in', { type: 'DateTime' })
    t.list.field('notInt', { type: 'DateTime' })
  },
})

schema.inputObjectType({
  name: 'IntFilter',

  definition(t) {
    t.field('equals', { type: 'Int' })
    t.field('not', { type: 'Int' })

    t.field('lt', { type: 'Int' })
    t.field('lte', { type: 'Int' })
    t.field('gt', { type: 'Int' })
    t.field('gte', { type: 'Int' })

    t.list.field('in', { type: 'Int' })
    t.list.field('notInt', { type: 'Int' })
  },
})

schema.inputObjectType({
  name: 'NullableIntFilter',

  definition(t) {
    t.field('equals', { type: 'Int' })
    t.field('not', { type: 'Int' })

    t.field('lt', { type: 'Int' })
    t.field('lte', { type: 'Int' })
    t.field('gt', { type: 'Int' })
    t.field('gte', { type: 'Int' })

    t.list.field('in', { type: 'Int' })
    t.list.field('notInt', { type: 'Int' })
  },
})

schema.inputObjectType({
  name: 'FloatFilter',

  definition(t) {
    t.field('equals', { type: 'Float' })
    t.field('not', { type: 'Float' })

    t.field('lt', { type: 'Float' })
    t.field('lte', { type: 'Float' })
    t.field('gt', { type: 'Float' })
    t.field('gte', { type: 'Float' })

    t.list.field('in', { type: 'Float' })
    t.list.field('notInt', { type: 'Float' })
  },
})

schema.inputObjectType({
  name: 'NullableFloatFilter',

  definition(t) {
    t.field('equals', { type: 'Float' })
    t.field('not', { type: 'Float' })

    t.field('lt', { type: 'Float' })
    t.field('lte', { type: 'Float' })
    t.field('gt', { type: 'Float' })
    t.field('gte', { type: 'Float' })

    t.list.field('in', { type: 'Float' })
    t.list.field('notInt', { type: 'Float' })
  },
})
