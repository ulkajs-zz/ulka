const fs = require("fs")
const fm = require("front-matter")
const { Remarkable } = require("remarkable")

const md = new Remarkable()

/**
 * Render markdown as html
 *
 * @param {String} filePath - Full path to the markdown file.
 * @param {Object} values - Variables to be available inside markdown
 * @return {any}
 */
function renderMarkdown(filePath) {
  const markdown = fs.readFileSync(filePath)
  const contents = fm(markdown)

  const html = md.render(contents.body)

  return {
    html,
    frontMatter: contents.attributes
  }
}

module.exports = {
  renderMarkdown
}
