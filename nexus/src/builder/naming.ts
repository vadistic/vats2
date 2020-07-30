import { AllInputTypes, AllOutputTypes } from '@nexus/schema'

import { AllScalarTypes, AllEnumTypes } from '../types'

const scalarFilterInputName = (typeName: AllScalarTypes, nullabe: boolean): AllInputTypes =>
  (nullabe ? `${typeName}NullableFilter` : `${typeName}Filter`) as AllInputTypes

const enumFilterInputName = (typeName: AllEnumTypes, nullabe: boolean): AllInputTypes =>
  (nullabe ? `${typeName}NullableEnumFilter` : `${typeName}EnumFilter`) as AllInputTypes

const filterInputName = (typeName: AllOutputTypes): AllInputTypes =>
  `${typeName}Filter` as AllInputTypes

const whereInputName = (typeName: AllOutputTypes): AllInputTypes =>
  `${typeName}Where` as AllInputTypes

const orderByInputName = (typeName: AllOutputTypes): AllInputTypes =>
  `${typeName}OrderBy` as AllInputTypes

export const naming = {
  scalarFilterInput: scalarFilterInputName,
  enumFilterInput: enumFilterInputName,
  filterInput: filterInputName,
  whereInput: whereInputName,
  orderByInput: orderByInputName,
}

export type Naming = typeof naming
