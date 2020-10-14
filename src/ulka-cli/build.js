const { contentToHtml, pageToHtml } = require("../utils/generate-utils")
const { createContentsMap, createPagesArray } = require("../utils/build-utils")
const log = require("../utils/ulka-log")
const { copyAssets } = require("../utils/helpers")

/**
 * @param {Object} info Info
 */
async function build(info) {
  try {
    let contentsMap = {}
    let pagesArray = []

    const startTime = Date.now()

    if (info.configs.pagesPath) {
      pagesArray = createPagesArray(info, contentsMap)
    }

    if (info.configs.contents.length > 0) {
      contentsMap = createContentsMap(info)
    }

    for (const plugin of info.configs.plugins.beforeBuild) {
      await plugin({ info, contentsMap, pagesArray })
    }

    console.log("")
    log.info("Generating html from markdown files...")
    for (const key in contentsMap) {
      if (contentsMap.hasOwnProperty(key)) {
        const contentsArray = contentsMap[key]

        for (const contentData of contentsArray) {
          await contentToHtml(contentData, contentsMap, info)
        }
      }
    }

    log.info("Generating html from pages files...")
    for (const pageData of pagesArray) {
      await pageToHtml(pageData, pagesArray, contentsMap, info)
    }

    log.info("Copying assets....")
    copyAssets(info)

    for (const plugin of info.configs.plugins.afterBuild) {
      await plugin({ info, contentsMap, pagesArray })
    }

    if (info.task === "build") {
      console.log("")
      log.success(`Build completed in ${Date.now() - startTime}ms`, true)
    }
  } catch (e) {
    console.log(e)
    console.log("")
    log.error("Build filed")
    process.exit(0)
  }
}

module.exports = build
