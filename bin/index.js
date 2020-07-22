#!/usr/bin/env node

const { program } = require('commander')

const { version } = require('../package.json')

program.version(version)

program.command('build').action(require('./build'))

program.command('serve').action(() => {
  require('./build')()
  require('./serve')()
})

program.parse(process.argv)
