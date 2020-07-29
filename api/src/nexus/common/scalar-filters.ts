import {
  booleanFilterBuilder,
  stringFilterBuilder,
  numberFilterBuilder,
} from './scalar-filter-builders'

export const IDFilter = booleanFilterBuilder({
  type: 'ID',
  nullable: false,
})

export const IDNullableFilter = booleanFilterBuilder({
  type: 'ID',
  nullable: true,
})

export const BooleanFilter = booleanFilterBuilder({
  type: 'Boolean',
  nullable: false,
})
export const BooleanNullableFilter = booleanFilterBuilder({
  type: 'Boolean',
  nullable: true,
})

export const JsonFilter = booleanFilterBuilder({
  type: 'Json',
  nullable: false,
})
export const JsonNullableFilter = booleanFilterBuilder({
  type: 'Json',
  nullable: true,
})

export const StringFilter = stringFilterBuilder({
  type: 'String',
  nullable: false,
})
export const StringNullableFilter = stringFilterBuilder({
  type: 'String',
  nullable: true,
})

export const URLFilter = stringFilterBuilder({
  type: 'URL',
  nullable: false,
})
export const URLNullableFilter = stringFilterBuilder({
  type: 'URL',
  nullable: true,
})

export const DateTimeFilter = numberFilterBuilder({
  type: 'DateTime',
  nullable: false,
})
export const DateTimeNullableFilter = numberFilterBuilder({
  type: 'DateTime',
  nullable: true,
})

export const IntFilter = numberFilterBuilder({
  type: 'Int',
  nullable: false,
})
export const IntNullableFilter = numberFilterBuilder({
  type: 'Int',
  nullable: true,
})

export const UnsignedIntFilter = numberFilterBuilder({
  type: 'UnsignedInt',
  nullable: false,
})
export const UnsignedIntNullableFilter = numberFilterBuilder({
  type: 'UnsignedInt',
  nullable: true,
})

export const FloatFilter = numberFilterBuilder({
  type: 'Float',
  nullable: false,
})
export const FloatNulalbleFilter = numberFilterBuilder({
  type: 'Float',
  nullable: true,
})

export const UnsignedFloatFilter = numberFilterBuilder({
  type: 'UnsignedFloat',
  nullable: false,
})
export const UnsignedFloatNullableFilter = numberFilterBuilder({
  type: 'UnsignedFloat',
  nullable: true,
})
