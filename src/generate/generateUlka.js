const fs = require('fs')
const path = require('path')
const mkdir = require('../fs/mkdir')
const globalInfo = require('../index')
const allFiles = require('../fs/allFiles')
const parseUlka = require('../parse/parseUlka')
const absolutePath = require('../utils/absolutePath')
const dataFromPath = require('../utils/dataFromPath')

const configs = globalInfo.configs

async function generateFromUlka() {
  // Get all files having .ulka extension
  let files
  try {
    files = allFiles(absolutePath(`src/${configs.pagesPath}`), '.ulka')
  } catch (e) {
    console.log('\n>>', e.message)
    process.exit(1)
  }

  // Get contents inside .ulka files and parse them
  const fileDatas = files.map(dataFromPath).map(fileData => ({
    ...fileData,
    data: parseUlka(fileData.data, { ...configs }, fileData.path),
    relativePath: path.relative(process.cwd(), fileData.path)
  }))

  for (let i = 0; i < fileDatas.length; i++) {
    const ufd = fileDatas[i]

    try {
      // For eg: \index.ulka or folder\file.ulka
      const [, filePath] = ufd.path.split(path.join('src', configs.pagesPath))

      const parsedPath = path.parse(filePath)

      // For eg: build\folder
      let createFilePath = configs.buildPath + parsedPath.dir

      /*
       * Check if the file name is indexIf not make a folder with filename
       * and change filename to index
       *
       * For eg: blog.ulka => blog/index.html, index.ulka => index.html
       */
      if (parsedPath.name !== 'index') {
        createFilePath += '/' + parsedPath.name
        parsedPath.name = 'index'
      }

      const absoluteFilePath = absolutePath(
        `${createFilePath}/${parsedPath.name}.html`
      )

      const html = (await ufd.data).html
      await mkdir(createFilePath).then(_ =>
        fs.writeFileSync(absoluteFilePath, html)
      )
    } catch (e) {
      console.log('\n>> Error while generating ', ufd.path)
      console.log('>>', e.message)
      process.exit(1)
    }
  }
}

generateFromUlka()

module.exports = generateFromUlka
