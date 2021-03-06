const fs = require("fs")
const path = require("path")

/**
 * Remove the directory recursively
 *
 * @param {String} pathToDirectory path to the directory
 */
function rmdir(pathToDirectory) {
  if (fs.existsSync(pathToDirectory)) {
    fs.readdirSync(pathToDirectory).forEach(file => {
      const curPath = path.join(pathToDirectory, file)
      if (fs.lstatSync(curPath).isDirectory()) {
        rmdir(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(pathToDirectory)
  } else {
    throw new Error(`Provided directory ${pathToDirectory} doesn't exist`)
  }
}

/**
 * Make the directory recursively
 * @param {String} pathToDirectory path to the directory
 */
function mkdir(pathToDirectory) {
  fs.mkdirSync(pathToDirectory, { recursive: true })
}

/**
 * Find all files is a directory using recursion
 *
 * @param {String} dirPath path to the directory to search files.
 * @param {String|String[]} [ext] extension of the files to search.
 * @param {String[]} [arrayOfFiles]
 * @return {String[]} Array of files
 */
function allFiles(dirPath, ext, arrayOfFiles = []) {
  try {
    const stat = fs.statSync(dirPath)

    if (!stat.isDirectory()) {
      return [dirPath]
    }

    const files = fs.readdirSync(dirPath)

    files.forEach(file => {
      const pathTo = path.join(dirPath, file)
      if (fs.statSync(pathTo).isDirectory()) {
        arrayOfFiles = allFiles(pathTo, ext, arrayOfFiles)
      } else {
        const fileExt = path.parse(file).ext

        const shouldPushToFilesArray =
          !ext ||
          (typeof ext === "string" && ext === fileExt) ||
          (Array.isArray(ext) && ext.includes(fileExt))

        if (shouldPushToFilesArray) arrayOfFiles.push(pathTo)
      }
    })

    return arrayOfFiles
  } catch (e) {
    console.log(e.message)
    throw new Error(`Error while finding all ${ext} files in ${dirPath}`)
  }
}

module.exports = {
  rmdir,
  mkdir,
  allFiles
}
