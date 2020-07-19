import f from 'faker'

export interface IdParam {
  id: string
}

export const randSubset = <T>(arr: T[], count: number) => {
  const set = new Set<T>()

  if (count > arr.length) {
    throw Error(`Cannot draw set of ${count} unique elements from array of length ${arr.length}`)
  }

  while (set.size < count) {
    const el = f.random.arrayElement(arr)
    set.add(el)
  }

  return Array.from(set)
}

export const pickId = <T extends IdParam>(el: T): IdParam => ({ id: el.id })

export const repeat = <T>(count: number, fn: (index: number) => T): T[] =>
  Array.from({ length: count }).map((_, i) => fn(i))
