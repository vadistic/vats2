import { indent } from './print'

describe('print', () => {
  test('indent', () => {
    expect(indent(['AAA', '  BBB'].join('\n'))).toMatchInlineSnapshot()
  })
})
