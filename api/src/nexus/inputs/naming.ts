import { AllInputTypes, AllOutputTypes } from '@nexus/schema'

import { AllScalarTypes, AllEnumTypes } from '../types'

export const scalarFilterInputName = (typeName: AllScalarTypes, nullabe: boolean) =>
  (nullabe ? `${typeName}NullableFilter` : `${typeName}Filter`) as AllInputTypes

export const enumFilterInputName = (typeName: AllEnumTypes, nullabe: boolean) =>
  (nullabe ? `${typeName}NullableEnumFilter` : `${typeName}EnumFilter`) as AllInputTypes

export const filterInputName = (typeName: AllOutputTypes) => `${typeName}Filter` as AllInputTypes

export const whereInputName = (typeName: AllOutputTypes) => `${typeName}Where` as AllInputTypes

export const orderByInputName = (typeName: AllOutputTypes) => `${typeName}OrderBy` as AllInputTypes
