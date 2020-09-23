import fs from "fs"
import { isAbsolute } from "path"
import absolutePath from "../utils/absolute-path"

const mkdir = async (pathname: string) => {
  if (!isAbsolute(pathname)) {
    pathname = absolutePath(pathname)
  }

  await fs.promises.mkdir(pathname, {
    recursive: true
  })
}

export default mkdir
