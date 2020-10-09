const fs = require("fs")
const fm = require("front-matter")
const { render } = require("ulka-parser")
const { Remarkable } = require("remarkable")

const md = new Remarkable()

/**
 * Render markdown as html
 *
 * @param {String} filePath - Full path to the markdown file.
 * @param {Object} values - Variables to be available inside markdown
 * @return {{html: String, frontMatter: Object}}
 */
function renderMarkdown(filePath, values) {
  const markdown = fs.readFileSync(filePath)
  const contents = fm(markdown)

  const html = md.render(contents.body)

  const htmlFromUlka = renderUlka(html)

  return {
    html: htmlFromUlka,
    frontMatter: contents.attributes
  }
}

/**
 * Render ulka as html
 *
 * @param {String} filePath
 * @param {Object} values
 * @return {String}
 */
function renderUlka(filePath, values) {
  const template = fs.readFileSync(filePath)
  const html = render(template, values)
  return html
}

module.exports = {
  renderMarkdown,
  renderUlka
}
