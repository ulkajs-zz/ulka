const { Remarkable } = require("remarkable")
const fm = require("front-matter")
const Ulka = require("./Ulka")

const md = new Remarkable({ html: true })

/** Markdown Class */
class Markdown {
  /**
   *
   * @param {String} raw Markdown
   * @param {String} filepath Path to the file
   * @param {Object} values Variables to be avaiable inside markdown
   * @param {String} cwd Current working directory
   */
  constructor(raw, filepath, values, cwd) {
    const content = fm(raw)

    this.raw = content.body
    this.frontMatter = content.attributes

    this.filepath = filepath || cwd
    this.values = values
    this.cwd = cwd
  }

  /**
   * @param {Boolean} ulka Support for ulka syntax inside markdown
   * @return {String} html
   */
  render(ulka = true) {
    let html = md.render(this.raw)

    // Support for ulka syntax markdown
    if (ulka) {
      const uInstace = new Ulka(
        html,
        this.filepath,
        { ...this.values, frontMatter: this.frontMatter },
        this.cwd
      )
      html = uInstace.render()
    }

    this.html = html

    return this.html
  }
}

module.exports = Markdown
