import { PrismaClient } from '@prisma/client'
import { seedWorkspaces } from './workspace'
import { seedUsers } from './user'
import { seedCandidates } from './candidate'

export const seed = async () => {
  const db = new PrismaClient()

  const workspaces = await seedWorkspaces(db)
  const users = await seedUsers(db, { workspaces })
  const candidates = await seedCandidates(db, { workspaces })

  const data = {
    workspaces,
    users,
    candidates,
  }

  console.log('Seed success!\n')

  Object.entries(data).forEach(([key, arr]) => {
    console.log(`${key.padEnd(16)}: ${arr.length}`)
  })

  await db.disconnect()
}

seed()
