const dataFromPath = require('../../src/utils/dataFromPath')
const absolutePath = require('../../src/utils/absolutePath')

describe('Datafrompath function', () => {
  test('should get data from path', () => {
    const data = dataFromPath(
      absolutePath('/tests/resources/ulka_test/ulka-config.js')
    )
    delete data.path
    expect(data).toMatchSnapshot()
  })
})
