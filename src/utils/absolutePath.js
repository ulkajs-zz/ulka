const path = require('path')

const absolutePath = args => {
  if (typeof args !== 'string') {
    throw new Error('Path provided should be string')
  }
  return path.join(process.cwd(), ...args.split('/'))
}

module.exports = absolutePath
