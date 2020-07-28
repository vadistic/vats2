import { PrintedGenTypingImportConfig, PrintedGenTyping } from '@nexus/schema/dist/core'

export interface PrintInterfaceConfig {
  name: string
  fields: string | PrintedGenTyping | (string | PrintedGenTyping)[]
}

export const printInterface = ({ name, fields }: PrintInterfaceConfig) => {
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

export const printImport = (config: PrintedGenTypingImportConfig) => {
  if (config.default) {
    return `import ${config.default} from '${config.module}'`
  }

  if (config.bindings) {
    return `import { ${config.bindings.join(', ')} } from '${config.module}'`
  }

  return 'INVALID_IMPORT_CONFIG'
}

export const printGlobal = (content: string | string[]) => {
  const inner = Array.isArray(content) ? content.join('\n\n') : content
  return 'declare global {\n' + indent(inner) + '\n}'
}

export const indent = (content: string, level = 1) =>
  ' '.repeat(level * 2) + content.replace(/\n/gm, '\n' + ' '.repeat(level * 2)).trim()
