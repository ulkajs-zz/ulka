const path = require("path")
const fs = require("fs")
const { createPagesMap } = require("./create-map")
const { mkdir } = require("../utils/ulka-fs")

/**
 * @param {Object} ulkaInfo
 * @param {String} cwd
 */
function generatePages(ulkaInfo, cwd) {
  const pagesMap = createPagesMap(ulkaInfo, cwd)

  Object.values(pagesMap).forEach(info => {
    mkdir(path.parse(info.buildPath).dir)
    fs.writeFileSync(info.buildPath, info.html)
  })
}

module.exports = generatePages
