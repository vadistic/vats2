import { objectType } from '@nexus/schema'

export const ClientModel = objectType({
  name: 'Client',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()
  },
})
