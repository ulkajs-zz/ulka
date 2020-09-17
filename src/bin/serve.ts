import http from "http"
import path, { parse } from "path"
import WebSocket from "ws"
import chokidar from "chokidar"
import portfinder from "portfinder"
import betterOpen from "better-opn"

import build from "./build"
import globalInfo from "../globalInfo"
import { copyAssets, rmdir } from "../fs"
import linePrint from "../utils/cli-utils/line-print"
import createServer from "../utils/cli-utils/create-server"
import generateFromUlka from "../utils/generate-utils/generate-from-ulka"

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
    })

  async function chokidarEvent(p: any) {
    console.clear()
    linePrint(">> File change detected", "yellow")
    const ext = path.parse(p).ext

    // await build()

    await experimentalBuildOnlyRequired(p)

    if (ext === ".css") {
      if (socket) socket.send("refresh-css")
    } else {
      if (socket) socket.send("reload-page")
    }

    linePrint(`>> Server is listening on port ${port}`, "yellow")
  }
}

async function experimentalBuildOnlyRequired(p: any) {
  const path = parse(p)
  if (path.ext === ".ulka") {
    if (!p.includes(globalInfo.configs.templatesPath)) {
      console.log(`>> Generating pages`.green)
      await generateFromUlka({ path: p })
    } else {
      await build()
    }
  } else if (path.ext === ".md") {
    await build()
  } else {
    console.log(`>> Copying assets`.green)
    await copyAssets()
  }
}

export default liveServer
