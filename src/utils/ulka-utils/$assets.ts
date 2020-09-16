import path from "path"
import generateFileName from "./generate-file-name"

const $assets = (rPath: string, filePath: string) => {
  // Generate hash of required file
  const fileName = generateFileName(path.join(path.parse(filePath).dir, rPath))

  const parsedPath = path.parse(rPath)

  // Check extension of required file
  const ext = parsedPath.ext

  // Return hashed fileName path
  return path.join(path.sep, "__assets__", fileName) + ext
}

export default $assets
