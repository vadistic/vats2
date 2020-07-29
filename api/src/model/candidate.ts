import { objectType } from '@nexus/schema'

export const CandidateModel = objectType({
  name: 'Candidate',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()

    t.custom.firstName()
    t.custom.lastName()
    t.custom.headline()
    t.custom.phones()
    t.custom.links()
    t.custom.emails()
  },
})
