#!/usr/bin/env node

const { program } = require('commander')

const { version } = require('../package.json')
const build = require('./build')
const serve = require('./serve')

program.version(version)
program.command('build').action(build)
program.command('serve').action(async () => {
  await build()
  await serve()
})

program.parse(process.argv)
