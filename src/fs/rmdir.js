const fs = require('fs')
// const path = require('path')
const absolutePath = require('../utils/absolutePath')

const removeDirectories = async pathname => {
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, '')
  return await fs.promises.rmdir(absolutePath(pathname), {
    recursive: true
  })
}

module.exports = removeDirectories
