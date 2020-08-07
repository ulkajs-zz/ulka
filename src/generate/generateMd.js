const fs = require('fs')
const path = require('path')
const mkdir = require('../fs/mkdir')
const allFiles = require('../fs/allFiles')
const parseMd = require('../parse/parseMd')
const parseUlka = require('../parse/parseUlka')
const configs = require('../parse/parseConfig')
const absolutePath = require('../utils/absolutePath')
const dataFromPath = require('../utils/dataFromPath')
const globalInfo = require('../index')

const { contents, templatesPath } = configs

async function generateFromMd() {
  // Get all files having .md extension from contentsPath
  let files
  try {
    files = allFiles(absolutePath(`src/${contents.path}`), '.md')
  } catch (e) {
    console.log('\n>>', e.message)
    process.exit(1)
  }

  // Get contents inside .md files and parse them
  const fileDatas = files.map(dataFromPath).map(fileData => ({
    ...fileData,
    data: parseMd(fileData.data),
    relativePath: path.relative(process.cwd(), fileData.path)
  }))

  for (let i = 0; i < fileDatas.length; i++) {
    const mfd = fileDatas[i]

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

    const templateData = await parseUlka(templateUlkaData, {
      frontMatter: (await mfd.data).frontMatter,
      data: (await mfd.data).html,
      ...configs
    })

    const link = createFilePath.split(configs.buildPath)[1]

    const html = templateData.html
    const frontMatter = (await mfd.data).frontMatter

    globalInfo.contentFiles.push({
      createFilePath,
      link: path.join(link, ''),
      html,
      frontMatter
    })

    await mkdir(createFilePath).then(() => {
      fs.writeFileSync(absoluteFilePath, templateData.html)
    })
  }
}

module.exports = generateFromMd
