const path = require("path")
const fs = require("fs")
const { mkdir } = require("../utils/ulka-fs")
const Ulka = require("./Ulka")

/**
 * @param {Object} pagesMap
 */
function generatePages(pagesMap) {
  Object.values(pagesMap).forEach(info => {
    mkdir(path.parse(info.buildPath).dir)
    fs.writeFileSync(info.buildPath, info.html)
  })
}

/**
 * @param {Object} contentsMap
 * @param {String} cwd
 */
function generateContents(contentsMap, cwd) {
  Object.keys(contentsMap).forEach(contentName => {
    const content = contentsMap[contentName]

    Object.values(content).forEach(info => {
      mkdir(path.parse(info.buildPath).dir)

      const templatePath = path.join(info.configs.templatesPath, info.template)

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

/**
 * @param {Object} pagesMap
 * @param {Object} contentsMap
 * @param {String} cwd
 */
function generate(pagesMap, contentsMap, cwd) {
  generatePages(pagesMap)
  generateContents(contentsMap, cwd)
}

module.exports = generate
