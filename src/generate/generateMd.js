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
const { contents, templatesPath } = configs

async function generateFromMd() {
  // Get all files having .md extension from contentsPath
  let files
  try {
    files = allFiles(absolutePath(`src/${contents.path}`), '.md')
  } catch (e) {
    console.log(`\n>> ${e.message}`.red)
    process.exit(0)
  }

  // Get contents inside .md files and parse them
  const fileDatas = files.map(dataFromPath).map(fileData => ({
    ...fileData,
    data: parseMd(fileData.data, fileData.path),
    relativePath: path.relative(process.cwd(), fileData.path)
  }))

  for (let i = 0; i < fileDatas.length; i++) {
    const mfd = fileDatas[i]

    try {
      //  For eg: \index.md or folder\file.md
      const [, filePath] = mfd.path.split(path.join('src', contents.path))

      const parsedPath = path.parse(filePath)

      // For eg: build/blog/post-1/
      let createFilePath =
        configs.buildPath + '/' + contents.generatePath + parsedPath.dir

      const markdownTemplatePath = absolutePath(
        `src/${templatesPath}/${contents.template}`
      )
      const templateUlkaData = fs.readFileSync(markdownTemplatePath, 'utf-8')

      if (parsedPath.name !== 'index') {
        createFilePath += '/' + parsedPath.name
        parsedPath.name = 'index'
      }
      const absoluteFilePath = absolutePath(
        `${createFilePath}/${parsedPath.name}.html`
      )

      const mfdData = await mfd.data

      const templateData = await parseUlka(
        templateUlkaData,
        {
          frontMatter: mfdData.frontMatter,
          data: mfdData.html,
          ...configs
        },
        markdownTemplatePath
      )

      const link = createFilePath.split(configs.buildPath)[1]

      const html = templateData.html
      const frontMatter = mfdData.frontMatter

      globalInfo.contentFiles.push({
        createFilePath,
        link: path.join(link, ''),
        html,
        frontMatter
      })

      await mkdir(createFilePath).then(() => {
        fs.writeFileSync(absoluteFilePath, templateData.html)
      })
    } catch (e) {
      console.log(`\n>> Error while generating ${mfd.path}`.red)
      throw e
    }
  }
}

module.exports = generateFromMd
