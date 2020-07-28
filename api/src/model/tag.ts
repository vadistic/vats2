import { objectType, extendType } from '@nexus/schema'

export const TagModel = objectType({
  name: 'Tag',
  definition(t) {
    t.custom.id()
    t.custom.createdAt({})
    t.custom.updatedAt({})
    t.custom.name()
    t.custom.description({})

    t.custom.candidates({ type: 'Candidate', alias: 'candidates1' })
    t.custom.candidates({ type: 'Candidate2', alias: 'candidates2' })
  },
})

export const TagModel2 = objectType({
  name: 'Tag2',
  definition(t) {
    t.custom('Tag').id()
    t.custom('Tag').createdAt()
    t.custom('Tag').updatedAt()
    t.custom('Tag').name()
    t.custom('Tag').description({})

    t.custom('Tag').candidates({ type: 'Candidate', alias: 'candidates1' })
    t.custom('Tag').candidates({ type: 'Candidate2', alias: 'candidates2' })
  },
})

export const CandidateModel = objectType({
  name: 'Candidate',
  definition(t) {
    t.custom.id()
    t.custom.createdAt()
    t.custom.updatedAt()
    t.custom.firstName()
    t.custom.lastName()
    t.custom.headline()
    t.custom.links({ type: 'URL' })
    t.custom.phones()
    t.custom.emails()

    t.custom.tags({ type: 'Tag', alias: 'tags1' })
    t.custom.tags({ type: 'Tag2', alias: 'tags2' })
  },
})

export const CandidateModel2 = objectType({
  name: 'Candidate2',
  definition(t) {
    t.custom('Candidate').id()
    t.custom('Candidate').createdAt()
    t.custom('Candidate').updatedAt()
    t.custom('Candidate').firstName()
    t.custom('Candidate').lastName()
    t.custom('Candidate').headline()
    t.custom('Candidate').links()
    t.custom('Candidate').phones()
    t.custom('Candidate').emails()

    t.custom('Candidate').tags({ type: 'Tag', alias: 'tags1' })
    t.custom('Candidate').tags({ type: 'Tag2', alias: 'tags2' })
  },
})

export const TagQuery = extendType({
  type: 'Query',
  definition(t) {},
})
