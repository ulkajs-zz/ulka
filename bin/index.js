#!/usr/bin/env node

const { program } = require("commander")
const build = require("../src/ulka-cli/build")

program.version(require("../package.json").version)

program
  .command("build")
  .description("Build html from .md and .ulka files")
  .action(() => build(process.cwd()))

program.parse(process.argv)
