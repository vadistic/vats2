/* eslint-disable import/no-extraneous-dependencies */
import { PrismaClient, Workspace } from '@prisma/client'
import f from 'faker'

export const seedWorkspaces = async (db: PrismaClient) => {
  const workspaces: Workspace[] = await db.transaction([
    db.workspace.create({
      data: {
        node: { create: {} },
        name: 'Vadistic Recruitment',
        description: 'Some vadistic recruitment company',
      },
    }),
    db.workspace.create({
      data: {
        node: { create: {} },
        name: 'Some Recruitment Agency',
        description: 'Some other recruitment company',
        website: f.internet.url(),
      },
    }),
  ])

  return workspaces
}
