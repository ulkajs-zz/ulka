#!/usr/bin/env node

// const path = require('path')
// const globalInfo = require('../src/index')
// const removeDirectories = require('../src/fs/rmdir')

const { program } = require('commander')

const build = require('./build')
const serve = require('./serve')
const { version } = require('../package.json')

program.version(version)
program.command('build').action(async () => {
  console.log('\n>> Building static sites\n')
  await build()
  console.log('\n>> Build finished\n')
})
program.command('serve').action(async () => {
  await build()
  await serve()
})

program.parse(process.argv)
