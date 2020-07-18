/* eslint-disable  */
const WebSocket = require('ws')
const chokidar = require('chokidar')
const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const configs = require('../src/parse/parseConfig')
const mimeType = require('../src/utils/mimeTypes')
const build = require('./build')

const port = 5000

const createServer = (req, res) => {
  try {
    console.log(`${req.method} ${req.url}`)

    const parsedUrl = url.parse(req.url)
    const sanitizePath = path
      .normalize(parsedUrl.pathname)
      .replace(/^(\.\.[\/\\])+/, '')

    let pathname = path.join(process.cwd(), 'build', sanitizePath)

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
            const ws = new WebSocket('ws://localhost:${port}');
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

const liveServer = () => {
  const server = http.createServer(createServer)

  const wss = new WebSocket.Server({ server: server.listen(port) })
  console.log(`Server listening on port ${port}`)
  let socket
  wss.on('connection', ws => {
    socket = ws
  })

  chokidar
    .watch(path.join(process.cwd(), 'src'), {
      ignoreInitial: true,
      awaitWriteFinish: {
        pollInterval: 400,
        stabilityThreshold: 400
      }
    })
    .on('add', chokidarEvent)
    .on('change', chokidarEvent)
    .on('unlink', chokidarEvent)

  function chokidarEvent(e) {
    if (!socket) return
    console.log(path.parse(e).ext)
    console.log('>> File change detected')
    build().then(() => {
      path.parse(e).ext === '.css'
        ? socket.send('refresh-css')
        : socket.send('reload-page')
    })
  }
}

module.exports = liveServer
