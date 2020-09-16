import fs from "fs"
import path from "path"

const allFiles = function (
  dirPath: string,
  ext?: string,
  arrayOfFiles: string[] | undefined = []
) {
  if (!fs.statSync(dirPath).isDirectory()) {
    return [dirPath]
  }

  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const pathTo = path.join(dirPath, file)
    if (fs.statSync(pathTo).isDirectory()) {
      arrayOfFiles = allFiles(pathTo, ext, arrayOfFiles)
    } else {
      if (!ext || file.endsWith(ext)) arrayOfFiles.push(pathTo)
    }
  })

  return arrayOfFiles
}

export default allFiles
