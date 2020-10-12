const log = require("../utils/ulka-log")
const generate = require("../generate/generate")
const { createContentMap, createPagesMap } = require("../generate/create-map")

/**
 *
 * @param {String} cwd
 * @param {Object} configs
 */
function build(cwd, configs) {
  try {
    const curTime = Date.now()

    log.success("Build process started")

    const contentsMap = createContentMap({ configs }, cwd)

    const pagesMap = createPagesMap({ configs }, { contents: contentsMap }, cwd)

    log.success("Generating html files")

    generate(pagesMap, contentsMap, cwd)

    log.info(`Build completed in ${Date.now() - curTime}ms`)
  } catch (e) {
    log.error(`Something went wrong. ${e}`)
    console.log(e)
    process.exit(0)
  }
}

module.exports = build
