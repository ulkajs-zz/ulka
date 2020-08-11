const path = require('path')
const fs = require('fs')

let ulkaConfigs = {}

try {
  const configExists = fs.existsSync(path.join(process.cwd(), 'ulka-config.js'))
  if (configExists) {
    ulkaConfigs = require(path.join(process.cwd(), 'ulka-config.js'))
  }
} catch (e) {
  console.log(`>> ${e.message}`.red)
  throw e
}

const defaultConfigs = {
  siteMetaData: {
    title: 'Ulka.Js',
    desription: 'UlkaJs - static site generator'
  },
  buildPath: 'build',
  pagesPath: 'pages',
  templatesPath: 'templates',
  plugins: [],
  contents: {
    path: 'contents',
    generatePath: 'blog',
    template: 'blog.ulka',
    // Pre parse run before parsing markdown to html
    preParse: [],
    // post parse runs after parsing markdown to html
    postParse: []
  }
}

module.exports = {
  ...defaultConfigs,
  ...ulkaConfigs
}
