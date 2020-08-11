#!/usr/bin/env node

const { program } = require('commander')
require('colors')

const build = require('./build')
const serve = require('./serve')
const { version } = require('../package.json')
const create = require('./create')

program.version(version)
program
  .command('build')
  .description('Build static files')
  .action(async () => {
    console.log('\n>> Building static files'.yellow)

    const startBuild = new Date().getTime()
    await build()
    const finishBuild = new Date().getTime()

    console.log(
      `>> Build finished in`.yellow,
      `${finishBuild - startBuild} ms`.yellow.bold
    )
  })

program
  .command('serve')
  .description('Creates live server and serve static sites')
  .action(async () => {
    await build()
    await serve()
  })

program
  .command('create <projectName> [template]')
  .description('Generates ulka project')
  .action(create)

program.parse(process.argv)
