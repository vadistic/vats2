import { schema } from 'nexus'

export const paginationArgs = {
  skip: schema.intArg(),
  take: schema.intArg(),
  cursor: schema.idArg(),
}
