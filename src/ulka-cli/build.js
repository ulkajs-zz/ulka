const generate = require("../generate/generate")
const { getConfigs } = require("../utils/helpers")
const { createContentMap, createPagesMap } = require("../generate/create-map")

/**
 *
 * @param {String} cwd
 */
function build(cwd) {
  const configs = getConfigs(cwd)

  const contentsMap = createContentMap({ configs }, cwd)

  const pagesMap = createPagesMap({ configs }, { contents: contentsMap }, cwd)

  generate(pagesMap, contentsMap, cwd)
}

module.exports = build
