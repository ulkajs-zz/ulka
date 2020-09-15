import { absolutePath, dataFromPath } from "../utils/path-utils"
import { parse } from "ulka-parser"

function generate(fileName: string) {
  return fileName
}

export async function fromUlka(fPath: string) {
  fPath = absolutePath(fPath)
  const { data } = dataFromPath(fPath)
  const ulkaData = await parse(data, {})
  return ulkaData
}

export function fromMd(fPath: string) {
  fPath = absolutePath(fPath)

  return fPath
}
export default generate
