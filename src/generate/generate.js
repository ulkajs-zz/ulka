const path = require("path")
const fs = require("fs")
const { createPagesMap, createContentMap } = require("./create-map")
const { mkdir } = require("../utils/ulka-fs")
const Ulka = require("./Ulka")

/**
 * @param {Object} ulkaInfo
 * @param {Object} contentsMap
 * @param {String} cwd
 */
function generatePages(ulkaInfo, contentsMap, cwd) {
  const pagesMap = createPagesMap(ulkaInfo, { contents: contentsMap }, cwd)

  Object.values(pagesMap).forEach(info => {
    mkdir(path.parse(info.buildPath).dir)
    fs.writeFileSync(info.buildPath, info.html)
  })
}

/**
 * @param {Object} ulkaInfo
 * @param {String} cwd
 */
function generateContents(ulkaInfo, cwd) {
  const contentsMap = createContentMap(ulkaInfo, cwd)

  Object.keys(contentsMap).forEach(contentName => {
    const content = contentsMap[contentName]

    Object.values(content).forEach(info => {
      mkdir(path.parse(info.buildPath).dir)

      const templatePath = path.join(
        ulkaInfo.configs.templatesPath,
        info.instance.contentInfo.template
      )

      const template = fs.readFileSync(templatePath, "utf-8")

      const context = {
        data: info.html,
        contentInfo: content,
        ...info
      }

      const uInstance = new Ulka(template, templatePath, context, cwd)

      uInstance.render()

      fs.writeFileSync(info.buildPath, uInstance.html)
    })
  })
}

const cwd = path.join(process.cwd(), "example")

const ulkaInfo = {
  configs: {
    buildPath: path.join(cwd, "build"),
    templatesPath: path.join(cwd, "templates"),
    pagesPath: path.join(cwd, "pages"),
    contents: [
      {
        path: path.join(cwd, "contents"),
        generatePath: "blog",
        template: "template.ulka",
        name: "blog"
      }
    ]
  }
}

generateContents(ulkaInfo, cwd)

generatePages(ulkaInfo, {}, cwd)

module.exports = {
  generatePages,
  generateContents
}
