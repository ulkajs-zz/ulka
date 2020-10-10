const { render } = require("ulka-parser")
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
    this.context = ulkaContext(values, filePath)
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
}

module.exports = Ulka
