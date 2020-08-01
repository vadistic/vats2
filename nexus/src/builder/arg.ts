/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { arg } from '@nexus/schema'
import { NexusArgDef, intArg, idArg } from '@nexus/schema/dist/core'
import { transform, isPlainObject } from 'lodash'

import { Config } from '../config'
import { TypeMetadata } from '../metadata/metadata'
import { cleanDeep } from '../utils/clean-deep'

export type ArgsDictionary = Record<string, NexusArgDef<string>>

export const buildUniqueArgs = (config: Config, { model, fields }: TypeMetadata) => {
  const simple = fields.filter(({ field }) => field.isId === true)
  const composite = model.idFields.map(
    modelField => fields.find(({ field }) => field.name === modelField)!,
  )

  return [...simple, ...composite].reduce((acc, { target, fieldName }) => {
    acc[fieldName] = arg({
      type: target,
      nullable: false,
      description: ``,
    })

    return acc
  }, {} as ArgsDictionary)
}

// TODO: implement
export const transformUniqueArgs = () => {
  /*  */
}

export const idArgs = (config: Config) => ({
  id: arg({
    type: config.idType,
    nullable: false,
    description: ``,
  }),
})

export const transformIdArgs = (args: any) => {
  return { where: { id: args.id } }
}

// TODO: configurable filterning, pagination, ordering
export const buildSearchArgs = (config: Config, { typeName }: TypeMetadata) => {
  const args: ArgsDictionary = {}

  args.where = arg({
    type: config.naming.whereInput(typeName),
    nullable: true,
    description: ``,
  })

  args.skip = intArg({
    nullable: true,
    description: ``,
  })

  args.take = intArg({
    nullable: true,
    description: ``,
    default: config.pagination.take.default,
  })

  args.cursor = idArg({
    nullable: true,
    description: ``,
  })

  return args
}

export const transformSearchArgs = (args: any) => {
  const res: any = { ...args }

  if ('where' in res) {
    const clean: any = cleanDeep(res.where)

    const withExists = transform(clean, (acc, value: any) => {
      if (isPlainObject(value) && 'exists' in value) {
        if (value.exists === true) {
          value.not = null
        }

        if (value.exists === false) {
          value = { eq: null }
        }
      }
    })

    res.where = withExists
  }

  if ('cursor' in res) {
    res.cursor = res.cursor ? { id: res.cursor } : undefined
  }

  if ('take' in res) {
    res.take = res.take ?? undefined
  }

  if ('skip' in res) {
    res.skip = res.skip ?? undefined
  }

  return res
}
