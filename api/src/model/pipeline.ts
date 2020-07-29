import { objectType } from '@nexus/schema'

export const PipelineModel = objectType({
  name: 'Pipeline',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()
  },
})
