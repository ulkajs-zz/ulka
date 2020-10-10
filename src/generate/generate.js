const fs = require("fs")
const { createPagesMap } = require("./create-map")

/**
 * @param {Object} ulkaInfo
 * @param {String} cwd
 */
function generatePages(ulkaInfo, cwd) {
  const pagesMap = createPagesMap(ulkaInfo, cwd)

  Object.values(pagesMap).forEach(info => {
    fs.writeFileSync(info.buildPath, info.html)
  })
}

module.exports = generatePages
