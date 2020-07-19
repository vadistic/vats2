import { schema } from 'nexus'
import { Kind } from 'graphql'

const RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/

schema.scalarType({
  name: 'DateTime',
  asNexusMethod: 'date',
  description: 'DateTime scalar type',
  parseValue(value: string) {
    const isValid = validateDateTime(value)

    if (!isValid) {
      throw Error(`Invalid DateTime ${value}`)
    }

    return new Date(value)
  },
  serialize(value: Date) {
    return value.toISOString()
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const isValid = validateDateTime(ast.value)

      if (!isValid) {
        throw Error(`Invalid DateTime ${ast.value}`)
      }

      return new Date(ast.value)
    }

    return null
  },
})

const validateDateTime = (dateTimeString: string) => {
  if (!RFC_3339_REGEX.test(dateTimeString)) {
    return false
  }
  const time = Date.parse(dateTimeString)
  if (time !== time) {
    return false
  }

  return true
}
