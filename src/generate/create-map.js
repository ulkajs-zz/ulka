const fs = require("fs")

const Ulka = require("./Ulka")
const { allFiles } = require("../utils/ulka-fs")
const Markdown = require("./Markdown")
const log = require("../utils/ulka-log")

/**
 * @param {Object} info
 * @param {Object} values
 * @param {String} cwd
 * @return {Object}
 */
function createPagesMap(info, values, cwd) {
  const { configs } = info
  const pagesFiles = allFiles(configs.pagesPath, ".ulka")

  const pagesMap = {}

  for (const page of pagesFiles) {
    try {
      const raw = fs.readFileSync(page, "utf-8")
      const uInstance = new Ulka(raw, page, { ulkaInfo: info, ...values }, cwd)

      const b = { configs, cwd, raw: uInstance.raw, context: uInstance.context }
      for (const plugin of configs.plugins.beforeUlkaRender) {
        const values = plugin(b) || {}
        uInstance.raw = values.raw || b.raw
        uInstance.context = values.context || b.context
      }

      uInstance.render()

      const a = { configs, cwd, html: uInstance.html }

      for (const plugin of configs.plugins.afterUlkaRender) {
        const values = plugin(a) || {}
        uInstance.html = values.html || a.html
      }

      uInstance.createInfo(info)
      pagesMap[page] = {
        ...uInstance.info,
        instance: uInstance,
        configs
      }
    } catch (e) {
      console.log("")
      log.error(`Error in ${page} `, true)
      log.error(e, true)
      console.log("")
    }
  }

  return pagesMap
}

/**
 * @param {Object} info
 * @param {String} cwd
 * @return {Object}
 */
function createContentMap(info, cwd) {
  const { configs } = info

  const contentsMap = {}

  for (const contentInfo of configs.contents) {
    const contentMap = {}

    const contentFiles = allFiles(contentInfo.path, ".md")

    for (const content of contentFiles) {
      const raw = fs.readFileSync(content, "utf-8")
      const mInstance = new Markdown(
        raw,
        content,
        { ulkaInfo: info },
        contentInfo,
        cwd
      )

      const b = { raw: mInstance.raw, configs, cwd, values: mInstance.values }
      for (const plugin of configs.plugins.beforeMdRender) {
        const values = plugin(b) || {}
        mInstance.raw = values.raw || b.raw
        mInstance.values = values.values || b.values
      }

      mInstance.render(true)

      const a = { html: mInstance.html, cwd, configs }
      for (const plugin of configs.plugins.beforeMdRender) {
        const values = plugin(a) || {}
        mInstance.raw = values.raw || a.raw
      }

      mInstance.createInfo(info)

      contentMap[content] = {
        ...mInstance.info,
        instance: mInstance,
        template: mInstance.contentInfo.template,
        configs
      }
    }

    contentsMap[contentInfo.name] = contentMap
  }

  return contentsMap
}

module.exports = {
  createPagesMap,
  createContentMap
}
