import { GetGen } from '@nexus/schema/dist/core'

export type AllScalarTypes = GetGen<'scalarNames'>
export type AllEnumTypes = GetGen<'enumNames'>
export type AllObjectTypes = GetGen<'objectNames'>
export type AllInterfaceTypes = GetGen<'interfaceNames'>

export type AllObjectLikeTypes = AllObjectTypes | AllInterfaceTypes
