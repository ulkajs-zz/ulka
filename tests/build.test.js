require('colors')
const fs = require('fs')
const build = require('../bin/build')
const absolutePath = require('../src/utils/absolutePath')
const globalInfo = require('../src/globalInfo')

const curDir = process.cwd()

describe('build function: ', () => {
  beforeEach(() => {
    process.chdir(absolutePath('tests/resources/ulka_test'))
  })

  afterEach(() => {
    process.chdir(curDir)
  })

  test('globalInfo should have info about content files', async () => {
    await build()
    const contentFiles = globalInfo.contentFiles.map(f => {
      delete f.createFilePath
      delete f.link
      return f
    })

    expect(contentFiles).toMatchSnapshot()
  })

  test('bulid folder should be created', () => {
    const buildExists = fs.existsSync(globalInfo.configs.buildPath)
    expect(buildExists).toBe(true)
  })
})
