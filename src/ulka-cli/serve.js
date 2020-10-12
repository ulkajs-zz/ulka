const chokidar = require("chokidar")
const { wsServer, server } = require("../server")
const log = require("../utils/ulka-log")
const build = require("./build")
const path = require("path")
const fs = require("fs")

const watch = (dir, cwd, websocket) => {
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

      build(cwd)

      if (websocket) {
        if (filePath.endsWith(".css")) {
          websocket.send("refresh-css")
        } else {
          websocket.send("reload-page")
        }
      }
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

  watch(configs.pagesPath, cwd, websocket)

  for (const content of configs.contents) {
    watch(content.path, cwd, websocket)
  }
}

module.exports = serve
