import { objectType } from '@nexus/schema'

export const ApplicationModel = objectType({
  name: 'Application',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()
  },
})
