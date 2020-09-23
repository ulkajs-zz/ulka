import crypto from "crypto"
import { isAbsolute, relative } from "path"

const generateFileName = (filePath: string) => {
  if (typeof filePath !== "string")
    throw new Error("FilePath provided should be string")

  if (isAbsolute(filePath)) filePath = relative(process.cwd(), filePath)

  return crypto.scryptSync(filePath, filePath, 15).toString("hex")
}

export default generateFileName
