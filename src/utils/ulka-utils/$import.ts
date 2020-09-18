import path from "path"
import { readFileSync } from "fs"
import fromMd from "../transform-utils/from-md"
import fromUlka from "../transform-utils/from-ulka"

const imgExts = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".svg", ".webp"]

/**
 * import contents from .ulka and .md files
 * import images, convert to base64 and return base64 link
 */
const $import = async (rPath: string, values: any, filePath: string) => {
  const file = path.join(path.parse(filePath).dir, rPath)
  const ext = path.parse(file).ext
  if (ext === ".ulka") {
    return await fromUlka(file, values)
  } else if (ext === ".md") {
    return (await fromMd(file)).html
  } else if (imgExts.includes(ext)) {
    return `data:image/${ext.substr(1)};base64,` + readFileSync(file, "base64")
  } else {
    return readFileSync(file, "utf-8")
  }
}

export default $import
