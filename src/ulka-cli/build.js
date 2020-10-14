const { contentToHtml, pageToHtml } = require("../utils/generate-utils")
const { createContentsMap, createPagesArray } = require("../utils/build-utils")
const log = require("../utils/ulka-log")

/**
 * @param {Object} info Info
 */
async function build(info) {
  try {
    let contentsMap = {}
    let pagesArray = []

    if (info.configs.pagesPath) {
      pagesArray = createPagesArray(info, contentsMap)
    }

    if (info.configs.contents.length > 0) {
      contentsMap = createContentsMap(info)
    }

    for (const plugin of info.configs.plugins.beforeBuild) {
      await plugin({ info, contentsMap, pagesArray })
    }

    for (const key in contentsMap) {
      if (contentsMap.hasOwnProperty(key)) {
        const contentsArray = contentsMap[key]

        for (const contentData of contentsArray) {
          await contentToHtml(contentData, contentsMap, info)
        }
      }
    }

    for (const pageData of pagesArray) {
      await pageToHtml(pageData, pagesArray, contentsMap, info)
    }

    for (const plugin of info.configs.plugins.afterBuild) {
      await plugin({ info, contentsMap, pagesArray })
    }
  } catch (e) {
    console.log(e)
    console.log("")
    log.error("Build filed")
    process.exit(0)
  }
}

module.exports = build
