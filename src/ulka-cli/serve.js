const fs = require("fs")
const path = require("path")
const chokidar = require("chokidar")

const build = require("./build")
const log = require("../utils/ulka-log")
const { wsServer, server } = require("../server")

const watch = (dir, cwd, reload, configs) => {
  return chokidar
    .watch(dir, {
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100
      }
    })
    .on("all", (event, filePath) => {
      const relativeDir = path.relative(cwd, dir)
      const relativePath = path.relative(cwd, filePath)
      log.info(`Change detected in ${relativeDir}: ${event} - ${relativePath}`)

      if (event === "unlink" && filePath.startsWith(cwd)) {
        fs.unlinkSync(filePath)
      }

      build(cwd, { configs })

      reload()
    })
}

/**
 * @param {Object} options
 * @param {Object} configs
 * @param {Object} cwd
 */
async function serve(options, configs, cwd) {
  const { port, live, base } = options

  if (!live) {
    server(options)
    return
  }

  let websocket

  const wss = await wsServer({ port, live, base })

  wss.on("connection", ws => {
    websocket = ws
  })

  const reload = () => {
    websocket.send("reload-page")
  }

  watch(configs.pagesPath, cwd, reload, configs)

  for (const content of configs.contents) {
    watch(content.path, cwd, reload, configs)
  }
}

module.exports = serve
