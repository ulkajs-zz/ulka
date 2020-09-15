import { IncomingMessage, ServerResponse } from "http"
import path from "path"
import url from "url"
import fs from "fs"

import globalInfo from "../../globalInfo"
import mimeType from "../mimeTypes"

const configs = globalInfo.configs

const createServer = (req: IncomingMessage, res: ServerResponse) => {
  try {
    const parsedUrl = url.parse(req.url!)

    const sanitizePath = path
      .normalize(parsedUrl.pathname!)
      .replace(/^(\.\.[/\\])+/, "")

    let pathname = path.join(process.cwd(), configs.buildPath, sanitizePath)

    if (!fs.existsSync(pathname)) {
      res.statusCode = 404
      res.end(`File ${pathname} not found!`)
      return
    }

    if (fs.statSync(pathname).isDirectory()) {
      pathname = path.join(pathname, "index.html")
    }

    let data = fs.readFileSync(pathname)
    const ext = path.parse(pathname).ext
    res.setHeader("Content-type", mimeType[ext] || "text/plain")

    if (ext === ".html") {
      // @ts-ignore
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

export default createServer
