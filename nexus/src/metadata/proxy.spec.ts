import { testDmmf } from '../../test/utils'

import { Metadata } from './metadata'
import { metadataProxy } from './proxy'

describe('metadataProxy', () => {
  const metadata = new Metadata(testDmmf())

  const handler = metadataProxy(metadata)

  const fn1 = jest.fn()
  const t1 = handler({ stage: 'walk', typeName: 'Tag', callback: fn1 })
  t1.id()

  const fn2 = jest.fn()
  const t2 = handler({ stage: 'build', typeName: 'Tag', callback: fn2 })
  t2.id()

  test('callback fn is called on both steps', () => {
    expect(fn1).toHaveBeenCalled()
    expect(fn2).toHaveBeenCalled()
  })

  test('correct metadatas', () => {
    expect(metadata.types.length).toBe(1)
    expect(Object.keys(metadata.typeMapping)).toMatchObject(['Tag'])

    expect(Array.from(metadata.refs)).toMatchObject(['Tag', 'String'])
    expect(metadata.typeMapping.Tag.typeName).toBe('Tag')

    expect(metadata.typeMapping.Tag.fields.length).toBe(1)
    expect(Object.keys(metadata.typeMapping.Tag.fieldMapping)).toMatchObject(['id'])
  })
})
