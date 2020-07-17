#!/usr/bin/env node

const { program } = require('commander')
const generateFromMd = require('../src/generate/generateMd')
const generateFromUlka = require('../src/generate/generateUlka')
const copyAssets = require('../src/fs/copyAssets')
const { version } = require('../package.json')

program.version(version)

program.command('build').action(() => {
  generateFromMd()
  generateFromUlka()
  copyAssets()
})

program.parse(process.argv)
