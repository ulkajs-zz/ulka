const fs = require('fs')
const mkdir = require('../../src/fs/mkdir')
const rmdir = require('../../src/fs/rmdir')
const absolutePath = require('../../src/utils/absolutePath')

const folderPath = 'tests/resources/fsmkrmdir_test/created_folder'

describe('add and remove directories', () => {
  test('should add directory', async () => {
    await mkdir(folderPath)
    const folderIsCreated = fs.existsSync(absolutePath(folderPath))
    expect(folderIsCreated).toBe(true)
  })

  test('should remove the created directory', async () => {
    await rmdir(folderPath)
    const folderStillExists = fs.existsSync(folderPath)
    expect(folderStillExists).toBe(false)
  })
})
