const fs = require("fs")
const path = require("path")

/**
 * Remove the directory recursively
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
 *
 * @param {String} dirPath path to the directory to search files.
 * @param {String} [ext] extension of the files to search.
 * @param {String[]} [arrayOfFiles]
 * @return {String[]} Array of files
 */
function allFiles(dirPath, ext, arrayOfFiles = []) {
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

module.exports = {
  rmdir,
  mkdir,
  allFiles
}
