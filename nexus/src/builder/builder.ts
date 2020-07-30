import type { PluginPrismaConfig } from '../plugin'

import { getDmmf, Dmmf } from './dmmf'

export class Builder {
  readonly dmmf: Dmmf

  constructor(readonly config: PluginPrismaConfig) {
    this.dmmf = getDmmf(config.prisma)
  }
}
