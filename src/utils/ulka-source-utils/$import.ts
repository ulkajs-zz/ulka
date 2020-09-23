import path from "path"
import { readFileSync } from "fs"
import UlkaSource from "../../source/ulka-source"
import MDSource from "../../source/md-source"

const imgExts = [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".svg", ".webp"]

/**
 * import contents from .ulka and .md files
 * import images, convert to base64 and return base64 link
 * returns content from file if not any of the above format.
 */
const $import = async (rPath: string, values: any, filePath: string) => {
  const file = path.join(path.parse(filePath).dir, rPath)
  const ext = path.parse(file).ext
  if (ext === ".ulka") {
    return await UlkaSource.transform({
      fPath: file,
      values
    })
  } else if (ext === ".md") {
    const data = await MDSource.transform({
      fPath: file
    })

    return data.html
  } else if (imgExts.includes(ext)) {
    return `data:image/${ext.substr(1)};base64,` + readFileSync(file, "base64")
  } else {
    return readFileSync(file, "utf-8")
  }
}

export default $import
