const fs = require("fs")
const path = require("path")
const chokidar = require("chokidar")

const build = require("./build")
const log = require("../utils/ulka-log")
const { wsServer, server } = require("../server")
const { rmdir } = require("../utils/ulka-fs")

const watch = (dir, info, reload) => {
  const { cwd } = info

  return chokidar
    .watch(dir, {
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 100
      }
    })
    .on("all", async (event, filePath) => {
      const relativeDir = path.relative(cwd, dir)
      const relativePath = path.relative(cwd, filePath)
      console.clear()
      log.info(`Change detected in ${relativeDir}: ${event} - ${relativePath}`)

      if (event === "unlink" && filePath.startsWith(cwd)) {
        fs.unlinkSync(filePath)
      }

      await build(info)

      reload()
    })
}

/**
 * @param {Object} options
 * @param {Object} info
 */
async function serve(options, info) {
  const { port, live, base } = options
  const { configs } = info

  if (!live) {
    server(options)

    serverLog(port)
    return
  }

  let websocket

  const wss = await wsServer({ port, live, base })

  serverLog(port)

  wss.on("connection", ws => {
    websocket = ws
  })

  const reload = (message = "reload-page") => {
    if (websocket) websocket.send(message)
    serverLog(port)
  }

  // watch(configs.pagesPath, info, reload, configs)

  // for (const content of configs.contents) {
  //   watch(content.path, info, reload)
  // }

  watch(path.join(info.cwd, "src"), info, reload)

  const exit = () => {
    if (info.task === "develop" && fs.existsSync(configs.buildPath)) {
      rmdir(configs.buildPath)
    }
    process.exit(0)
  }

  process.on("exit", () => {
    if (info.task === "develop" && fs.existsSync(configs.buildPath)) {
      rmdir(configs.buildPath)
    }
  })

  process.on("SIGINT", exit)
  process.on("SIGUSR1", exit)
  process.on("SIGUSR2", exit)
  process.on("uncaughtException", exit)
}

/**
 * @param {Number} port
 */
function serverLog(port) {
  console.log("=".repeat(process.stdout.columns))
  log.normal("ULKA LIVE SERVER\n")
  log.success(`Server is listening on port ${port}`, true)
  log.info(`http://localhost:${port}`)
  console.log("=".repeat(process.stdout.columns))
}

module.exports = serve
