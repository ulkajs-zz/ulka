#!/usr/bin/env node

const path = require("path")
const { program } = require("commander")
const build = require("../src/ulka-cli/build")
const serve = require("../src/ulka-cli/serve")
const { getConfigs } = require("../src/utils/helpers")

program.version(require("../package.json").version)

const cwd = process.cwd()

program
  .command("build")
  .description("Build html from .md and .ulka files")
  .action(() => {
    const configs = getConfigs(cwd)
    build(cwd, configs)
  })

program
  .command("serve")
  .option("-p --port [port]", "server port", 3000)
  .description("Start dev server")
  .action(({ port }) => {
    const configs = getConfigs(cwd)

    configs.buildPath = path.join(cwd, ".debug")

    build(cwd, configs)

    port = +port || 3000
    serve({ live: true, base: configs.buildPath, port: +port }, configs, cwd)
  })

program.parse(process.argv)
