/* eslint-disable consistent-return */
import { log, SettingsInput } from '@nexus/logger'
import { plugin } from '@nexus/schema'

import { LOG_LEVEL } from '../../config'

export interface LoggerPluginConfig extends SettingsInput {}

export const loggerPlugin = (loggerConifg: LoggerPluginConfig = {}) => {
  const settings = {
    pretty: loggerConifg.pretty ?? true,
    data: { pid: false, hostname: false, ...loggerConifg.data },
    filter:
      typeof loggerConifg.filter === 'string'
        ? loggerConifg.filter
        : { level: LOG_LEVEL, ...loggerConifg.filter },
    output: { write: console.log, ...loggerConifg.output },
  }

  log.settings(settings)

  return plugin({
    name: 'Logger',
    description: 'The logger plugin provides context logging utils',
    onCreateFieldResolver(config) {
      const parent = config.parentTypeConfig.name
      const field = config.fieldConfig.name
      const logger = log.child(parent).child(field)

      return async (root, args, ctx, info, next) => {
        const res = await next(root, args, { ...ctx, log: logger }, info)

        const context: Record<string, any> = { args }

        if (res instanceof Error) {
          context.error = {
            name: res.name,
            message: res.message,
            code: (res as any).extensions?.code,
          }

          context.data = null
        } else {
          context.data = res
          context.error = null
        }

        logger.debug('operation', context)

        return res
      }
    },
  })
}
