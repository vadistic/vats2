/* eslint-disable import/no-extraneous-dependencies */
import { PrismaClient, CandidateCreateInput, Workspace, Candidate } from '@prisma/client'
import f from 'faker'

import { repeat } from '../utils'

const CANDIDATES_COUNT = 50

export interface SeedCandidatesDeps {
  workspaces: Workspace[]
}

export const seedCandidates = async (db: PrismaClient, { workspaces }: SeedCandidatesDeps) => {
  const generateCandidate = (): CandidateCreateInput => {
    const gender = f.random.number({ min: 0, max: 1 })

    const firstName = f.name.firstName(gender)
    const lastName = f.name.lastName(gender)

    return {
      node: { create: {} },
      workspace: { connect: { id: f.random.arrayElement(workspaces).id } },
      firstName,
      lastName,
      emails: {
        set: repeat(f.random.number({ min: 0, max: 3 }), () =>
          f.internet.email(firstName, lastName),
        ),
      },
      phones: {
        set: repeat(f.random.number({ min: 0, max: 3 }), () => f.phone.phoneNumber('ZZ')),
      },
      links: {
        set: repeat(f.random.number({ min: 0, max: 3 }), () => f.internet.url()),
      },
    }
  }

  const candidates: Candidate[] = await db.transaction(
    repeat(CANDIDATES_COUNT, () =>
      db.candidate.create({
        data: generateCandidate(),
      }),
    ),
  )

  return candidates
}
