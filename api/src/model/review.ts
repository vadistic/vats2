import { objectType } from '@nexus/schema'

export const ReviewModel = objectType({
  name: 'Review',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()
  },
})
