const fs = require('fs')
const absolutePath = require('../utils/absolutePath')

const createDirectories = async pathname => {
  pathname = pathname.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, '')
  return await fs.promises.mkdir(absolutePath(pathname), {
    recursive: true
  })
}

createDirectories('src/pages')

module.exports = createDirectories
