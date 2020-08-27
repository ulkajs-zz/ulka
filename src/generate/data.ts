import path from "path"
import allFiles from "../fs/allFiles"
import dataFromPath from "../utils/dataFromPath"

const data = (
  filePath: string,
  ext: string,
  parser: (raw: string, path?: string) => any
) => {
  try {
    return allFiles(filePath, ext)
      .map(dataFromPath)
      .map((fileData: { data: string; path: string }) => ({
        ...fileData,
        data: parser(fileData.data, fileData.path),
        relativePath: path.relative(process.cwd(), fileData.path)
      }))
  } catch (e) {
    console.log(`\n>> ${e.message}`.red)
    process.exit(0)
  }
}

export default data
