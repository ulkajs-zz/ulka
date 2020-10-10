const fs = require("fs")

const Ulka = require("./Ulka")
const { allFiles } = require("../utils/ulka-fs")
const Markdown = require("./Markdown")

/**
 * @param {Object} ulkaInfo
 * @param {String} cwd
 * @return {Object}
 */
function createPagesMap(ulkaInfo, cwd) {
  const { configs } = ulkaInfo
  const pagesFiles = allFiles(configs.pagesPath, ".ulka")

  const pagesMap = {}

  for (const page of pagesFiles) {
    const raw = fs.readFileSync(page, "utf-8")
    const uInstance = new Ulka(raw, page, { ulkaInfo }, cwd)
    uInstance.render()
    uInstance.createInfo(ulkaInfo)
    pagesMap[page] = {
      ...uInstance.info,
      instance: uInstance
    }
  }

  return pagesMap
}

/**
 * @param {Object} ulkaInfo
 * @param {String} cwd
 * @return {Object}
 */
function createContentMap(ulkaInfo, cwd) {
  const { configs } = ulkaInfo

  const contentsMap = {}

  for (const contentInfo of configs.contents) {
    const contentMap = {}

    const contentFiles = allFiles(contentInfo.path, ".md")

    for (const content of contentFiles) {
      const raw = fs.readFileSync(content, "utf-8")
      const mInstance = new Markdown(
        raw,
        content,
        { ulkaInfo },
        contentInfo,
        cwd
      )

      mInstance.render(true)
      mInstance.createInfo(ulkaInfo)

      contentMap[content] = {
        ...mInstance.info,
        instance: mInstance
      }
    }

    contentsMap[contentInfo.name] = contentMap
  }

  return contentsMap
}

module.exports = {
  createPagesMap,
  createContentMap
}
