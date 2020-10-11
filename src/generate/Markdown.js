const fs = require("fs")
const url = require("url")
const path = require("path")
const fm = require("front-matter")
const { Remarkable } = require("remarkable")
const Ulka = require("./Ulka")

const md = new Remarkable({ html: true })

/** Markdown Class */
class Markdown {
  /**
   * @param {String} raw Markdown
   * @param {String} filepath Path to the file
   * @param {Object} values Variables to be avaiable inside markdown
   * @param {{path:String, template: String, generatePath: String, name: String}} contentInfo
   * @param {String} cwd Current working directory
   */
  constructor(raw, filepath, values, contentInfo, cwd) {
    const content = fm(raw)

    this.raw = content.body
    this.frontMatter = content.attributes
    this.contentInfo = contentInfo
    this.filepath = filepath || cwd
    this.values = values
    this.cwd = cwd
  }

  /**
   * @param {Boolean} renderUlka Support for ulka syntax inside markdown
   * @return {String} html
   */
  render(renderUlka = true) {
    let html = md.render(this.raw)
    // Support for ulka syntax markdown
    if (renderUlka) {
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

  /**
   * @param {Object} ulkaInfo
   * @return {Object} info
   */
  createInfo(ulkaInfo) {
    const { configs } = ulkaInfo
    const { path: cPath, generatePath: genPath } = this.contentInfo

    const filePath = this.filepath
    const fileStat = fs.statSync(filePath)

    const filePathFromPages = path.relative(cPath, filePath)

    const parsedPath = path.parse(filePathFromPages)

    let buildPath = path.join(configs.buildPath, genPath, parsedPath.dir)

    if (parsedPath.name === "index") {
      buildPath = path.join(buildPath, "index.html")
    } else {
      buildPath = path.join(buildPath, parsedPath.name, "index.html")
    }

    const link = path.relative(configs.buildPath, buildPath).slice(0, -10)

    this.link = url.format(link)

    if (!this.link.startsWith("/")) {
      this.link = "/" + this.link
    }

    const cwd = this.cwd

    this.info = {
      buildPath,
      createdAt: fileStat.ctime,
      modifiedAt: fileStat.mtime,
      html: this.html,
      mdPath: path.relative(cwd, cPath),
      link: this.link,
      frontMatter: this.frontMatter,
      values: this.values
    }

    return this.info
  }
}

module.exports = Markdown
