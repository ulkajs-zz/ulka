import { absolutePath } from "../utils/path-utils"

function generate(fileName: string) {
  return fileName
}

export function fromUlka(fPath: string) {
  fPath = absolutePath(fPath)

  return fPath
}

export function fromMd(fPath: string) {
  fPath = absolutePath(fPath)

  return fPath
}
export default generate
