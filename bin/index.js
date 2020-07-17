#!/usr/bin/env node

const { program } = require('commander')
const generateFromMd = require('../src/generate/generateMd')
const generateFromUlka = require('../src/generate/generateUlka')
const { version } = require('../package.json')

program.version(version)

program.command('build').action(() => {
  generateFromMd()
  generateFromUlka()
})

program.parse(process.argv)
