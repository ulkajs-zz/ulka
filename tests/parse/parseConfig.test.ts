import configs from '../../src/parse/parseConfig'

describe('PraseConfigs', () => {
  test('returns default configs', () => {
    expect(configs).toMatchSnapshot()
  })
})
