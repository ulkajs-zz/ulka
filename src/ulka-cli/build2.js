const { contentToHtml, pageToHtml } = require("../utils/render-utils")
const { createContentsMap, createPagesArray } = require("../utils/build-utils")

/**
 * @param {Object} info Info
 */
async function build(info) {
  const contentsMap = createContentsMap(info)
  const pagesArray = createPagesArray(info, contentsMap)

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
}

module.exports = build
