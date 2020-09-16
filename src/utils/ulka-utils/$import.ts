import path from "path"
import { readFileSync } from "fs"
import { fromMd, fromUlka } from "../transform-utils"

const $import = async (rPath: string, values: any, filePath: string) => {
  const file = path.join(path.parse(filePath).dir, rPath)
  const ext = path.parse(file).ext
  if (ext === ".ulka") return await fromUlka(file, values)
  else if (ext === ".md") return (await fromMd(file)).html
  else if ([".png", ".jpg", ".jpeg"].includes(ext))
    return "data:image/jpg;base64," + readFileSync(file, "base64")
  else return readFileSync(file, "utf-8")
}

export default $import
