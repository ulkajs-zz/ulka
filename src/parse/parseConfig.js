const path = require('path')

let ulkaConfigs

try {
  ulkaConfigs = require(path.join(process.cwd(), 'ulka-config.js'))
} catch (e) {
  console.log("\n>> Can't find ulka-config.js file in root directory")
  console.log('>> Please run `npx ulka --init` or create ulka-config.js')
  process.exit(1)
}

const defaultConfigs = {
  siteMetaData: {
    title: 'Ulka.Js',
    desription: 'UlkaJs - static site generator'
  },
  buildPath: 'build',
  pagesPath: 'pages',
  templatesPath: 'templates',
  contents: {
    path: 'contents',
    generatePath: 'blog',
    template: 'blog.ulka'
  }
}

// TODO: REQUIRE PLUGINS AND PROCESSS

module.exports = {
  ...defaultConfigs,
  ...ulkaConfigs
}
