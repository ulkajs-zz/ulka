#!/usr/bin/env node

const { program } = require('commander')
require('colors')

const build = require('./build')
const serve = require('./serve')
const { version } = require('../package.json')

program.version(version)
program.command('build').action(async () => {
  console.log('\n>> Building static files'.yellow)

  const startBuild = new Date().getTime()
  await build()
  const finishBuild = new Date().getTime()

  console.log(
    `>> Build finished in`.yellow,
    `${finishBuild - startBuild} ms`.yellow.bold
  )
})
program.command('serve').action(async () => {
  await build()
  await serve()
})

program.parse(process.argv)
