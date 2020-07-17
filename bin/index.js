#!/usr/bin/env node

const { program } = require('commander')

const { version } = require('../package.json')

program.version(version)

program.command('build').action(require('./build'))

program.parse(process.argv)
