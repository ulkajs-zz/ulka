const fs = require("fs")
const url = require("url")
const http = require("http")
const path = require("path")
const getport = require("get-port")

const log = require("../../utils/ulka-log")

/**
 * @typedef {{base: String, live: Boolean, port: Number}} Options
 */

const mimeTypesMap = {
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".doc": "application/msword",
  ".eot": "application/vnd.ms-fontobject",
  ".ttf": "application/x-font-ttf",
  ".xml": "application/xml"
}

const liveReloadScript = `
// Live Serve
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

/**
 *
 * @param {http.IncomingMessage} req
 * @param {http.OutgoingMessage} res
 * @param {Options} options
 */
function createServer(req, res, options) {
  try {
    const parsedUrl = url.parse(req.url)

    let pathname = path.join(options.base, parsedUrl.pathname)

    if (!fs.existsSync(pathname)) {
      res.statusCode = 404
      let message = `File ${pathname} not found!`

      const possible404File = path.join(options.base, "404.html")

      if (fs.existsSync(possible404File)) {
        message = fs.readFileSync(possible404File)
        res.setHeader("Content-type", "text/html")
      }

      res.end(message)
      return
    }

    if (fs.statSync(pathname).isDirectory()) {
      pathname = path.join(pathname, "index.html")
    }

    let data = fs.readFileSync(pathname)

    const ext = path.parse(pathname).ext

    res.setHeader("Content-type", mimeTypesMap[ext] || "text/plain")

    if (ext === ".html" && options.live !== false) {
      data += liveReloadScript
    }

    res.end(data)
  } catch (e) {
    res.statusCode = 500
    res.end(e.message)
  }
}

/**
 *
 * @param {Options} options
 * @return {Promise<http.Server>} httpserver
 */
async function server(options) {
  try {
    const port = await getport({ port: options.port || 3000 })
    const httpserver = http.createServer((req, res) =>
      createServer(req, res, options)
    )

    httpserver.listen(port)

    log.success(`Server is listening on port ${port}`)

    return httpserver
  } catch (e) {
    log.error(`Live server failed!!! ${e}`)
    process.exit(0)
  }
}

module.exports = server
