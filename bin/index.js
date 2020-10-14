#!/usr/bin/env node

const path = require("path")
const { program } = require("commander")
const build = require("../src/ulka-cli/build")
const build2 = require("../src/ulka-cli/build2")
const serve = require("../src/ulka-cli/serve")
const { getConfigs } = require("../src/utils/helpers")
const create = require("../src/ulka-cli/create")

program.version(require("../package.json").version)

const cwd = process.cwd()

program
  .command("build")
  .description("Build html from .md and .ulka files")
  .action(() => {
    const configs = getConfigs(cwd)
    build(cwd, { configs })
  })

program
  .command("buildnext")
  .description("Build html from .md and .ulka files")
  .action(async () => {
    const info = {
      configs: getConfigs(cwd),
      cwd: cwd,
      task: "building"
    }
    try {
      await build2(info)
    } catch (e) {
      console.log(e.message)
      console.log(e)
    }
  })

program
  .command("develop")
  .option("-p --port [port]", "server port", 3000)
  .description("Start dev server")
  .action(({ port }) => {
    const configs = getConfigs(cwd)

    configs.buildPath = path.join(cwd, ".debug")

    build(cwd, { configs })

    port = +port || 3000
    serve({ live: true, base: configs.buildPath, port: +port }, configs, cwd)
  })

program
  .command("serve")
  .option("-p --port [port]", "server port", 3000)
  .description("Serve built static files")
  .action(({ port }) => {
    const configs = getConfigs(cwd)

    port = +port || 3000
    serve({ live: false, base: configs.buildPath, port: +port }, configs, cwd)
  })

program
  .command("create [projectName] [template]")
  .option("-i --installer [installer]", "Installer to use npm|yarn")
  .description("Create new ulka project")
  .action((name, template, { installer }) => {
    create({ template: template, name, installer })
  })

program.parse(process.argv)
