import path from "path"
import { fromMd, fromUlka } from "../transform-utils"

const $import = async (rPath: string, values: any, filePath: string) => {
  const file = path.join(path.parse(filePath).dir, rPath)
  if (file.endsWith(".ulka")) return await fromUlka(file, values)
  else if (file.endsWith(".md")) return await fromMd(file)
}

export default $import
