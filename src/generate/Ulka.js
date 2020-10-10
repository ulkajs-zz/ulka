const fs = require("fs")
const path = require("path")
const { render } = require("ulka-parser")
const { absolutePath } = require("../utils/helpers")
const { ulkaContext } = require("../utils/render-utils")

/** Class ULka */
class Ulka {
  /**
   * @param {String} raw Raw ulka template
   * @param {String} filePath Path to the file
   * @param {Object} values Variables to be available inside ulka
   * @param {Object} cwd Current working directory
   */
  constructor(raw, filePath, values, cwd) {
    this.raw = raw
    this.filePath = filePath || cwd
    this.context = ulkaContext(values, filePath, cwd)
    this.cwd = cwd
  }

  /**
   * Transform raw ulka to html
   * @return {String} html
   */
  render() {
    this.html = render(this.raw, this.context, { base: this.filePath })
    return this.html
  }

  /**
   * @param {Object} ulkaInfo Ulka Info
   * @return {Object} info
   */
  createInfo(ulkaInfo) {
    const { configs } = ulkaInfo

    const fileStat = fs.statSync(this.filePath)
    const filePathFromPages = path.relative(configs.pagesPath, this.filePath)
    const parsedPath = path.parse(filePathFromPages)

    let buildPath = absolutePath(`${configs.buildPath}/${parsedPath.dir}`)

    if (parsedPath.name === "index") {
      buildPath = path.join(buildPath, "index.html")
    } else {
      buildPath = path.join(buildPath, parsedPath.name, "index.html")
    }

    this.info = {
      buildPath,
      createdAt: fileStat.ctime,
      modifiedAt: fileStat.mtime,
      html: this.html
    }

    return this.info
  }
}

module.exports = Ulka
