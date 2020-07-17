const mkdir = require('../fs/mkdir')
const fs = require('fs')

async function generate(createFilePath, absoluteFilePath, data) {
  await mkdir(createFilePath).then(_ =>
    fs.writeFileSync(absoluteFilePath, data)
  )
}

module.exports = generate
