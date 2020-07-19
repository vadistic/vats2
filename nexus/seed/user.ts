import { PrismaClient, User, UserCreateInput, Workspace } from '@prisma/client'
import f from 'faker'
import { randSubset, pickId, repeat } from './utils'

const USERS_COUNT = 10

export interface SeedUsersDeps {
  workspaces: Workspace[]
}

export const seedUsers = async (db: PrismaClient, { workspaces }: SeedUsersDeps) => {
  const generateUser = (): UserCreateInput => {
    const gender = f.random.number({ min: 0, max: 1 })

    const firstName = f.name.firstName(gender)
    const lastName = f.name.lastName(gender)
    const email = f.internet.email(firstName, lastName)

    return {
      node: { create: {} },
      email,
      workspaces: { connect: randSubset(workspaces, f.random.number({ min: 1, max: 2 })).map(pickId) },
    }
  }

  const users: User[] = await db.transaction([
    db.user.create({
      data: {
        node: { create: {} },
        email: 'vadistic@gmail.com',
      },
    }),
    ...repeat(USERS_COUNT, () =>
      db.user.create({
        data: generateUser(),
      })
    ),
  ])

  return users
}
