import { getDmmf, Dmmf } from '../metadata/dmmf'
import type { PluginPrismaConfig } from '../plugin'

export class Builder {
  readonly dmmf: Dmmf

  constructor(readonly config: PluginPrismaConfig) {
    this.dmmf = getDmmf(config.prisma)
  }
}
