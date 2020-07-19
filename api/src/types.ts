export type Maybe<T> = T | null | undefined

export type ID = string

export type IDInput = {
  id: ID
}

type Scalar = string | number | boolean | Date

export type NonNull<T> = T extends null ? never : T

export type DeepNonNull<T> = T extends Scalar
  ? NonNull<T>
  : T extends Array<any>
  ? _DeepNonNullArray<T[number]>
  : T extends Record<string, unknown>
  ? _DeepNonNullObject<T>
  : NonNull<T>

export interface _DeepNonNullArray<T> extends Array<DeepNonNull<NonNull<T>>> {}

export type _DeepNonNullObject<T> = {
  [P in keyof T]: DeepNonNull<NonNull<T[P]>>
}
