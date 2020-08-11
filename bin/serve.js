/* eslint-disable  */
const fs = require('fs')
const url = require('url')
const http = require('http')
const path = require('path')
const WebSocket = require('ws')
const chokidar = require('chokidar')
const portfinder = require('portfinder')
const betterOpen = require('better-opn')

const build = require('./build')
const configs = require('../src/parse/parseConfig')
const mimeType = require('../src/utils/mimeTypes')
const copyAssets = require('../src/fs/copyAssets')
const removeDirectories = require('../src/fs/rmdir')
const globalInfo = require('../src')
const linePrint = require('../src/utils/linePrint')

const createServer = (req, res) => {
  try {
    // console.log(`${req.method} ${req.url}`)

    const parsedUrl = url.parse(req.url)
    const sanitizePath = path
      .normalize(parsedUrl.pathname)
      .replace(/^(\.\.[\/\\])+/, '')

    let pathname = path.join(process.cwd(), configs.buildPath, sanitizePath)

    if (!fs.existsSync(pathname)) {
      res.statusCode = 404
      res.end(`File ${pathname} not found!`)
      return
    }

    if (fs.statSync(pathname).isDirectory()) {
      pathname = path.join(pathname, 'index.html')
    }

    let data = fs.readFileSync(pathname)
    const ext = path.parse(pathname).ext
    res.setHeader('Content-type', mimeType[ext] || 'text/plain')

    if (ext === '.html') {
      data += `
        <script>
        if ('WebSocket' in window) {
            const protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
            const address = protocol + window.location.host + window.location.pathname;
            const ws = new WebSocket(address);
            ws.addEventListener('message', e => {
              if (e.data === 'refresh-css') {
                const links = document.querySelectorAll("link[rel='stylesheet']");
                links.forEach(link => {
                  link.href += "";
                })
              }

              if(e.data === "reload-page") location.reload()
            });
        }else {
          console.warn("Your browser doesn't support websockets, so can't live reload")
        }
        </script>  
        `
    }
    res.end(data)
  } catch (e) {
    res.statusCode = 500
    res.end(e.message)
  }
}

const liveServer = async (usersPort = 3000) => {
  const port = await portfinder.getPortPromise({ port: usersPort })

  const server = http.createServer(createServer)

  const wss = new WebSocket.Server({ server: server.listen(port) })

  linePrint(`>> Server is listening on port ${port}`, 'yellow')

  let socket
  wss.on('connection', ws => {
    socket = ws
  })

  if (!socket) await betterOpen(`http://localhost:${port}`)

  chokidar
    .watch(path.join(process.cwd(), 'src'), {
      ignoreInitial: true,
      awaitWriteFinish: {
        pollInterval: 400,
        stabilityThreshold: 400
      }
    })
    .on('change', chokidarEvent)
    .on('add', chokidarEvent)
    .on('unlink', async (p, s) => {
      const assetsPath = path.join(globalInfo.configs.buildPath, '__assets__')
      await removeDirectories(assetsPath)
      await chokidarEvent(p, s)
    })

  async function chokidarEvent(p) {
    console.clear()
    linePrint('>> File change detected', 'yellow')
    const ext = path.parse(p).ext

    if (ext === '.css') {
      console.log('>> Copying assets'.green)
      await copyAssets()
      if (socket) socket.send('refresh-css')
    } else {
      await build()
      if (socket) socket.send('reload-page')
    }

    linePrint(`>> Server is listening on port ${port}`, 'yellow')
  }
}

module.exports = liveServer
