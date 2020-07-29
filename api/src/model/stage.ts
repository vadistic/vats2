import { objectType } from '@nexus/schema'

export const StageModel = objectType({
  name: 'Stage',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()
  },
})
