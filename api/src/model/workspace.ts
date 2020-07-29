import { objectType } from '@nexus/schema'

export const WorkspaceModel = objectType({
  name: 'Workspace',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()

    t.custom.name()
    t.custom.description()
    t.custom.website()
    t.custom.type()
  },
})
