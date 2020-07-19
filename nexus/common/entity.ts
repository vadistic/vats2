import { schema } from 'nexus'

import { Resolver } from '../types'
import { fluentProxy, Segment } from '../utils/fluent-proxy'

import { NexusObjectTypeDefinition, NexusObjectTypeDefinitionProxy } from './nexus'

export interface EntityConfig {
  name: string
  definition: NexusObjectTypeDefinition
}

interface ObjectFieldConfig {
  type: string
  nullable?: boolean
  list?: boolean
  description?: string
  authorize?: Resolver
  resolve?: Resolver
  args?: any
}

interface InputFieldConfig {
  default?: any
  nullable?: boolean
  required?: boolean
  depreciation?: string
  list?: boolean
  description?: string
  type: string
}

const methodToScalar = {
  string: 'String',
  boolean: 'Boolean',
  int: 'Int',
  float: 'Float',
  date: 'DateTime',
  id: 'ID',
}

const scalars = Object.values(methodToScalar)

const isScalarType = (type: string) => {
  return scalars.includes(type as any)
}

const applyFields = (t: any, fields: [string, ObjectFieldConfig | InputFieldConfig][]) => {
  fields.forEach(([fieldname, config]) => {
    t.field(fieldname, config)
  })
}

const getFields = (definition: NexusObjectTypeDefinition, typename: string) => {
  const proxy = fluentProxy<NexusObjectTypeDefinitionProxy>()

  definition(proxy)

  const processOneProxy = (
    [[method, [args]], ...rest]: Segment[],
    isList = false,
  ): [string, ObjectFieldConfig] => {
    if (method === 'list') {
      return processOneProxy(rest, true)
    }

    const config: any = (args || []).find(el => typeof el === 'object') || {}
    const fieldname: any = (args || []).find(el => typeof el === 'string')

    if (!fieldname) {
      throw Error(`cannot resolve fieldname for nexus method '${method}' of ${typename}`)
    }

    if (isList) {
      config.list = true
    }

    if (!config.type) {
      const type = (methodToScalar as Record<string, string | undefined>)[method]

      if (!type) {
        console.error(
          `cannot resolve type for nexus method '${method}' in field '${fieldname}' of ${typename}`,
        )
      }

      config.type = type
    }

    return [fieldname, config]
  }

  const fields: [string, ObjectFieldConfig][] = proxy.state.map(segments =>
    processOneProxy(segments),
  )

  return fields
}

export const entity = ({ name: typename, definition }: EntityConfig) => {
  const fields = getFields(definition, typename)
  const scalarFields = fields.filter(([, { type }]) => isScalarType(type))

  const createInputFields = scalarFields.map<[string, InputFieldConfig]>(([fieldname, prev]) => {
    const config = {
      nullable: prev.nullable ?? true,
      list: prev.list,
      type: prev.type,
      description:
        prev.description || `create input for ${typename} ${fieldname} field - \`${prev.type}\``,
    }

    return [fieldname, config]
  })

  const updateInputFields = scalarFields.map<[string, InputFieldConfig]>(([fieldname, prev]) => {
    const config = {
      nullable: true,
      list: prev.list,
      type: prev.type,
      description:
        prev.description || `update input for ${typename} ${fieldname} field - \`${prev.type}\``,
    }

    return [fieldname, config]
  })

  const whereInputFields = scalarFields.map<[string, InputFieldConfig]>(
    ([fieldname, { type, nullable }]) => {
      return [fieldname, { type: (nullable ? 'Nullable' : '') + type + 'Filter' }]
    },
  )

  schema.objectType({
    name: typename,
    definition(t) {
      t.implements('Node')

      applyFields(t, fields)
    },
  })

  schema.inputObjectType({
    name: typename + 'CreateInput',

    definition(t) {
      applyFields(t, createInputFields)
    },
  })

  schema.inputObjectType({
    name: typename + 'UpdateInput',

    definition(t) {
      applyFields(t, updateInputFields)
    },
  })

  const whereInputName = (typename + 'WhereInput') as any

  schema.inputObjectType({
    name: whereInputName,

    definition(t) {
      applyFields(t, whereInputFields)

      t.field('AND', { type: whereInputName, list: true })
      t.field('OR', { type: whereInputName, list: true })
      t.field('NOT', { type: whereInputName })
    },
  })

  schema.inputObjectType({
    name: typename + 'Filter',
    definition(t) {
      t.field('every', { type: whereInputName })
      t.field('none', { type: whereInputName })
      t.field('some', { type: whereInputName })
    },
  })
}
