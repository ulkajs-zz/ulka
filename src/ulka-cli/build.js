const generate = require("../generate/generate")
const { createContentMap, createPagesMap } = require("../generate/create-map")
const log = require("../utils/ulka-log")

/**
 *
 * @param {String} cwd
 * @param {Object} configs
 */
function build(cwd, configs) {
  const curTime = Date.now()
  log.success("Build process started")

  const contentsMap = createContentMap({ configs }, cwd)

  const pagesMap = createPagesMap({ configs }, { contents: contentsMap }, cwd)

  log.success("Generating html files")
  generate(pagesMap, contentsMap, cwd)

  log.info(`Build completed in ${Date.now() - curTime}ms`)
}

module.exports = build
