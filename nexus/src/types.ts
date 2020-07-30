import type { CommonOutputFieldConfig, AllOutputTypes, GetGen } from '@nexus/schema/dist/core'

export type AllScalarTypes = GetGen<'scalarNames'>
export type AllEnumTypes = GetGen<'enumNames'>
export type AllObjectTypes = GetGen<'objectNames'>
export type AllInterfaceTypes = GetGen<'interfaceNames'>
export type AllUnionTypes = GetGen<'unionNames'>
export type AllObjectLikeTypes = AllObjectTypes | AllInterfaceTypes

export type Context = GetGen<'context'>

export type AllPrismaOutputTypes = keyof PrismaGen['outputs']

export type PrismaModels = PrismaGen['models']

export type PrismaPluginFieldConfig<
  TypeName extends string,
  FieldName extends string,
  ModelField extends string
> = CommonOutputFieldConfig<TypeName, FieldName> & {
  type?: AllOutputTypes
  alias?: FieldName
}

export type PrismaPluginProperty<TypeName extends string> = TypeName extends AllPrismaOutputTypes
  ? SimplePrismaPluginProperty<TypeName>
  : AliasedPrismaPluginProperty<TypeName>

export type SimplePrismaPluginProperty<ModelName extends AllPrismaOutputTypes> = {
  [K in keyof PrismaGen['outputs'][ModelName] & string]: <FieldName extends string>(
    config?: PrismaPluginFieldConfig<ModelName, FieldName, K>,
  ) => void
}

export type AliasedPrismaPluginProperty<TypeName extends string> = <
  ModelName extends AllPrismaOutputTypes
>(
  model: ModelName,
) => {
  [K in keyof PrismaGen['outputs'][ModelName] & string]: <FieldName extends string>(
    config?: PrismaPluginFieldConfig<TypeName, FieldName, K>,
  ) => void
}
