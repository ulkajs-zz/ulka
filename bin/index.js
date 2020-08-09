#!/usr/bin/env node

// const path = require('path')
// const globalInfo = require('../src/index')
// const removeDirectories = require('../src/fs/rmdir')

const { program } = require('commander')
require('colors')

const build = require('./build')
const serve = require('./serve')
const { version } = require('../package.json')

program.version(version)
program.command('build').action(async () => {
  console.log('>> Building static files\n'.green)

  const startBuild = new Date().getTime()
  await build()
  const finishBuild = new Date().getTime()

  console.log(
    `\n>> Build finished in`.green,
    `${finishBuild - startBuild} ms`.green.bold
  )
})
program.command('serve').action(async () => {
  await build()
  await serve()
})

program.parse(process.argv)
