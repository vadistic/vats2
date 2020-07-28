import { Logger } from '@nexus/logger'
import { PrismaClient } from '@vats/database'

import { IDInput, Maybe } from '../types'

// SCALARS

export type DateTime = Date
export type JSON = any
export type URL = string
export type UnsignedFloat = number
export type UnsignedInt = number

// CONTEXT

export interface Context {
  db: PrismaClient
  log: Logger
}

// Role

export type Role = 'USER' | 'ADMIN'

// PAGINATION

export interface PaginationArgs {
  skip?: Maybe<number>
  take?: Maybe<number>
  cursor?: Maybe<IDInput>
}
