import { dynamicOutputProperty } from '@nexus/schema'

export const timestampsProperty = dynamicOutputProperty({
  name: 'timestamps',
  typeDefinition: `: () => void`,
  factory({ typeDef: t }) {
    return () => {
      t.field('createdAt', { type: 'DateTime' })
      t.field('updatedAt', { type: 'DateTime' })
    }
  },
})
