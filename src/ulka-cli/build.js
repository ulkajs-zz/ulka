const log = require("../utils/ulka-log")
const generate = require("../generate/generate")
const { createContentMap, createPagesMap } = require("../generate/create-map")

/**
 *
 * @param {String} cwd
 * @param {Object} info
 */
function build(cwd, info) {
  try {
    const { configs } = info

    const curTime = Date.now()

    log.success("Build process started")

    const contentsMap = createContentMap({ configs }, cwd)

    const pagesMap = createPagesMap({ configs }, { contents: contentsMap }, cwd)

    log.success("Generating html files")

    configs.plugins.beforeBuild.forEach(plugin =>
      plugin({ info, pagesMap, contentsMap, cwd })
    )

    generate(pagesMap, contentsMap, cwd)

    configs.plugins.afterBuild.forEach(plugin => plugin({ info, cwd }))

    log.info(`Build completed in ${Date.now() - curTime}ms`)
  } catch (e) {
    log.error(`Something went wrong. ${e}`)
    console.log(e)
    process.exit(0)
  }
}

module.exports = build
