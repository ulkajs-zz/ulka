const fs = require("fs")
const { renderMarkdown } = require("../utils/render-utils")
/**
 *
 * @param {Object} ulkaInfo
 */
function generateHTML(ulkaInfo) {
  for (const page of ulkaInfo.pages) {
    fs.writeFileSync(page.path, page.content)
  }

  for (const key in ulkaInfo.contents) {
    if (ulkaInfo.contents.hasOwnProperty(key)) {
      const content = ulkaInfo.contents[key]

      if (content.contentType === "markdown" || content.contentType === "md") {
        content.content = renderMarkdown(content.content, content, true)
        content.contentType = "html"
      }

      if (content.contentType === "html") {
        fs.writeFileSync(content.path, content.content)
      }
    }
  }
}

module.exports = generateHTML
