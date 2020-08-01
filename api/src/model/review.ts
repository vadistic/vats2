import { objectType } from '@nexus/schema'

export const ReviewModel = objectType({
  name: 'Review',
  definition(t) {
    t.model.id()
    t.model.createdAt()
    t.model.updatedAt()
  },
})
