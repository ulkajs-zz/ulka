import http from "http"
import path from "path"
import WebSocket from "ws"
import chokidar from "chokidar"
import portfinder from "portfinder"
import betterOpen from "better-opn"

import build from "./build"
import { rmdir } from "../fs"
import globalInfo from "../globalInfo"
import createServer from "../utils/cli-utils/create-server"
import linePrint from "../utils/cli-utils/line-print"

const liveServer = async (usersPort = 3000) => {
  const port = await portfinder.getPortPromise({ port: usersPort })

  const server = http.createServer(createServer)

  const wss = new WebSocket.Server({ server: server.listen(port) })

  linePrint(`>> Server is listening on port ${port}`, "yellow")

  let socket: WebSocket | null = null
  wss.on("connection", ws => {
    socket = ws
  })

  if (!socket) await betterOpen(`http://localhost:${port}`)

  chokidar
    .watch(path.join(process.cwd(), "src"), {
      ignoreInitial: true,
      awaitWriteFinish: {
        pollInterval: 400,
        stabilityThreshold: 400
      }
    })
    .on("change", chokidarEvent)
    .on("add", chokidarEvent)
    .on("unlink", async (p: any) => {
      const assetsPath = path.join(globalInfo.configs.buildPath, "__assets__")
      rmdir(assetsPath)
      await chokidarEvent(p)
    })

  async function chokidarEvent(p: any) {
    console.clear()
    linePrint(">> File change detected", "yellow")
    const ext = path.parse(p).ext

    await build()

    if (ext === ".css") {
      if (socket) socket.send("refresh-css")
    } else {
      if (socket) socket.send("reload-page")
    }

    linePrint(`>> Server is listening on port ${port}`, "yellow")
  }
}

export default liveServer
