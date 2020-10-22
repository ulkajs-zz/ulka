const {
  createContentsMap,
  createPagesArray,
  contentToHtml,
  pageToHtml
} = require("../utils/build-utils")

const log = require("../utils/ulka-log")
const { copyAssets } = require("../utils/helpers")

/**
 * @param {Object} info Info
 */
async function build(info) {
  try {
    let contentsMap = {}
    let pagesArray = []

    const startTime = new Date().getTime()

    for (const plugin of info.configs.plugins.beforeSetup) {
      await plugin({ info })
    }

    if (info.configs.pagesPath) {
      pagesArray = createPagesArray(info, contentsMap)
    }

    if (info.configs.contents.length > 0) {
      contentsMap = createContentsMap(info)
    }

    if (info.configs.plugins.beforeBuild.length > 0)
      log.info("Executing beforeBuild plugins")

    for (const plugin of info.configs.plugins.beforeBuild) {
      await plugin({ info, contentsMap, pagesArray })
    }

    log.info("Generating html from contents...")
    for (const key in contentsMap) {
      if (contentsMap.hasOwnProperty(key)) {
        const contentsArray = contentsMap[key]

        for (const contentData of contentsArray) {
          await contentToHtml(contentData, contentsMap, info)
        }
      }
    }

    console.log("")
    log.info("Generating html from pages...")
    for (const pageData of pagesArray) {
      await pageToHtml(pageData, pagesArray, contentsMap, info)
    }

    log.info("Copying assets....\n")
    copyAssets(info)

    if (info.configs.plugins.afterBuild.length > 0)
      log.info("Executing afterBuild plugins")

    for (const plugin of info.configs.plugins.afterBuild) {
      await plugin({ info, contentsMap, pagesArray })
    }

    if (info.task === "build") {
      console.log("")
      log.success(
        `Build completed in ${(new Date().getTime() - startTime) / 1000}s`,
        true
      )
    }
  } catch (e) {
    console.log(e)
    console.log("")
    log.error("Build failed")
    process.exit(0)
  }
}

module.exports = build
