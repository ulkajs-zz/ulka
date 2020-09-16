import fs from "fs"
import path from "path"
import { absolutePath } from "../utils/path-utils"

const removeDirectories = (pathname: string) => {
  pathname = pathname.replace(/^\.*\/|\/?[^/]+\.[a-z]+|\/$/g, "")
  rmdirSync(absolutePath(pathname))
}

function rmdirSync(pathname: string) {
  try {
    if (fs.existsSync(pathname)) {
      fs.readdirSync(pathname).forEach(file => {
        const curPath = path.join(pathname, file)
        if (fs.lstatSync(curPath).isDirectory()) {
          rmdirSync(curPath)
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(pathname)
    }
  } catch (e) {
    console.log(`>> ${e.message}`)
  }
}

export default removeDirectories
