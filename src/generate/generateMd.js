const fs = require('fs')
const path = require('path')

const mkdir = require('../fs/mkdir')
const globalInfo = require('../index')
const allFiles = require('../fs/allFiles')
const parseMd = require('../parse/parseMd')
const parseUlka = require('../parse/parseUlka')
const absolutePath = require('../utils/absolutePath')
const dataFromPath = require('../utils/dataFromPath')

const configs = globalInfo.configs

async function generateFromMd() {
  // Get all markdown files' path from contents path
  let files
  try {
    files = allFiles(absolutePath(`src/${configs.contents.path}`), '.md')
  } catch (e) {
    console.log(`\n>> ${e.message}`.red)
    process.exit(0)
  }

  /**
   * Get Data from filepath
   * Prase data using parseMd function
   */
  const fileDatas = files.map(dataFromPath).map(fileData => ({
    ...fileData,
    data: parseMd(fileData.data, fileData.path),
    relativePath: path.relative(process.cwd(), fileData.path)
  }))

  for (let i = 0; i < fileDatas.length; i++) {
    const mfd = fileDatas[i]

    // Get filepath eg: \index.md, \post-1\index.md
    const filePath = mfd.path.split(path.join('src', configs.contents.path))[1]

    // Prase filepath
    const parsedPath = path.parse(filePath)

    // filePath to create .html files
    let createFilePath =
      configs.buildPath + '/' + configs.contents.generatePath + parsedPath.dir

    // If name of file is not index, then create folder with fileName and change fileName to index
    if (parsedPath.name !== 'index') {
      createFilePath += '/' + parsedPath.name
      parsedPath.name = 'index'
    }

    // Data after parsing markdown
    const mfdData = await mfd.data
    // Url link to the file
    const link = createFilePath.split(configs.buildPath)[1]

    // Absolute Filepath to create html files
    const absoluteFilePath = absolutePath(
      `${createFilePath}/${parsedPath.name}.html`
    )

    // Push parsed datas info globalInfo
    globalInfo.contentFiles.push({
      html: mfdData.html,
      frontMatter: mfdData.frontMatter,
      link: path.join(link, ''),
      createFilePath,
      absoluteFilePath
    })
  }

  for (let i = 0; i < fileDatas.length; i++) {
    const mfd = fileDatas[i]

    try {
      // Path to the template of markdown files
      const markdownTemplatePath = absolutePath(
        `src/${configs.templatesPath}/${configs.contents.template}`
      )
      // Templatefile data
      const templateUlkaData = fs.readFileSync(markdownTemplatePath, 'utf-8')

      // Previosly parsed data that was pushed to globalInfo
      const mfdData = globalInfo.contentFiles[i]

      // Prase template ulka file with the value of parsed markdown
      const templateData = await parseUlka(
        templateUlkaData,
        {
          frontMatter: mfdData.frontMatter,
          data: mfdData.html,
          globalInfo
        },
        markdownTemplatePath
      )

      // Rewrite html to the parsed html from templates
      globalInfo.contentFiles[i].html = templateData.html

      // Create folder to generate html file
      await mkdir(mfdData.createFilePath)

      // Create html files
      fs.writeFileSync(mfdData.absoluteFilePath, templateData.html)
    } catch (e) {
      console.log(`\n>> Error while generating ${mfd.path}`.red)
      throw e
    }
  }
}

module.exports = generateFromMd
