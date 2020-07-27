import { PrintedGenTypingImport, PrintedGenTyping, StringLike } from '@nexus/schema/dist/core'

import { ModelProxyValue } from './builder'

export interface PrintInterfaceConfig {
  name: string
  fields: string | PrintedGenTypingImport | PrintedGenTyping | StringLike[]
}

export const pintInterface = ({ name, fields }: PrintInterfaceConfig) => {
  let res = `export interface ${name} {\n`

  if (Array.isArray(fields)) {
    fields.forEach(field => {
      res += '  ' + field.toString() + '\n'
    })
  } else {
    res += '  ' + fields.toString() + '\n'
  }

  res += '}'

  return res
}

export const printImport = ({ config }: PrintedGenTypingImport) => {
  if (config.default) {
    return `import ${config.default} from '${config.module}'`
  }

  if (config.bindings) {
    return `import { ${config.bindings.join(', ')} } from '${config.module}'`
  }

  return 'INVALID_IMPORT_CONFIG'
}

export const printPrismaOutputs = (proxies: ModelProxyValue[]) => {}
