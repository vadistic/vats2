import { objectType } from '@nexus/schema'

export const FieldDefinitionModel = objectType({
  name: 'FieldDefinition',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()

    t.custom.name()
    t.custom.description()

    t.custom.type()
  },
})

export const FieldValueModel = objectType({
  name: 'FieldValue',
  definition(t) {
    t.custom.value()

    t.custom.definition()
  },
})
