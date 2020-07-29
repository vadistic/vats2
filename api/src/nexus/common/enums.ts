import { enumType } from '@nexus/schema'

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortDirection = typeof SortDirection[keyof typeof SortDirection]

export const SortDirectionEnum = enumType({
  name: 'SortDirection',
  members: SortDirection,
})
