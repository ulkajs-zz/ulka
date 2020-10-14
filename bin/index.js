#!/usr/bin/env node

const path = require("path")
const { program } = require("commander")
const build = require("../src/ulka-cli/build")
const serve = require("../src/ulka-cli/serve")
const { getConfigs } = require("../src/utils/helpers")
const create = require("../src/ulka-cli/create")
const log = require("../src/utils/ulka-log")

program.version(require("../package.json").version)

const cwd = process.cwd()

program
  .command("build")
  .description("Build html from .md and .ulka files")
  .action(async () => {
    const info = createInfo(cwd, "build")
    await build(info)
  })

program
  .command("develop")
  .option("-p --port [port]", "server port", 3000)
  .description("Start dev server")
  .action(async ({ port }) => {
    const info = createInfo(cwd, "develop")

    info.configs.buildPath = path.join(cwd, ".debug")

    await build(info)

    port = +port || 3000

    const options = { live: true, base: info.configs.buildPath, port: +port }

    serve(options, info)
  })

program
  .command("serve")
  .option("-p --port [port]", "server port", 3000)
  .description("Serve built static files")
  .action(({ port }) => {
    const info = createInfo(cwd, "build")

    port = +port || 3000
    serve(
      { live: false, base: info.configs.buildPath, port: +port },
      info.configs,
      cwd
    )
  })

program
  .command("create [projectName] [template]")
  .option("-i --installer [installer]", "Installer to use npm|yarn")
  .description("Create new ulka project")
  .action((name, template, { installer }) => {
    create({ template: template, name, installer })
  })

program.parse(process.argv)

/**
 * @param {String} cwd cwd
 * @param {String} task current rask
 * @return {Object} info
 */
function createInfo(cwd, task) {
  try {
    return {
      configs: getConfigs(cwd),
      cwd,
      task
    }
  } catch (e) {
    log.error(e.message, true)
    process.exit(0)
  }
}
