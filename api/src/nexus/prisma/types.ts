import { CommonOutputFieldConfig, AllOutputTypes } from '@nexus/schema/dist/core'

export type AllPrismaOutputs = keyof PrismaGen['outputs']
export type PrismaModels = PrismaGen['models']

export type PrismaPluginFieldConfig<
  TypeName extends string,
  FieldName extends string,
  ModelField extends string
> = CommonOutputFieldConfig<TypeName, FieldName> & {
  type?: AllOutputTypes
  alias?: FieldName
}

export type PrismaPluginProperty<TypeName extends string> = TypeName extends AllPrismaOutputs
  ? SimplePrismaPluginProperty<TypeName>
  : AliasedPrismaPluginProperty<TypeName>

export type SimplePrismaPluginProperty<ModelName extends AllPrismaOutputs> = {
  [K in keyof PrismaGen['outputs'][ModelName] & string]: <FieldName extends string>(
    config?: PrismaPluginFieldConfig<ModelName, FieldName, K>,
  ) => void
}

export type AliasedPrismaPluginProperty<TypeName extends string> = <
  ModelName extends AllPrismaOutputs
>(
  model: ModelName,
) => {
  [K in keyof PrismaGen['outputs'][ModelName] & string]: <FieldName extends string>(
    config?: PrismaPluginFieldConfig<TypeName, FieldName, K>,
  ) => void
}
