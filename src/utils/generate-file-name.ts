import crypto from "crypto"
import { isAbsolute, relative, sep } from "path"

const generateFileName = (filePath: string) => {
  if (typeof filePath !== "string")
    throw new Error("FilePath provided should be string")

  if (isAbsolute(filePath))
    filePath = relative(process.cwd(), filePath).split(sep).join("/")

  return crypto.scryptSync(filePath, filePath, 15).toString("hex")
}

export default generateFileName
