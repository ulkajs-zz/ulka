const prompts = require("prompts")
const { execSync } = require("child_process")
const log = require("../utils/ulka-log")
const { rmdir } = require("../utils/ulka-fs")
const path = require("path")
const { unlinkSync } = require("fs")
const fetch = require("node-fetch")
const GitHost = require("hosted-git-info")
const { spinner } = require("../utils/helpers")

/**
 * Create new ulka project
 * @param {any} args
 */
async function create(args) {
  try {
    const questions = []

    if (!args.name) {
      questions.push({
        name: "name",
        message: "Name of project",
        type: "text",
        initial: "ulka-static-site"
      })
    }

    if (!args.template) {
      questions.push({
        name: "template",
        message: "Starter template",
        type: "text",
        initial: "https://github.com/ulkajs/ulka-starter-default",
        validate(value) {
          return value.trim() !== ""
        }
      })
    }

    if (!args.installer) {
      questions.push({
        name: "installer",
        message: "Choose installer",
        choices: ["npm", "yarn"],
        type: "select"
      })
    }

    const values = await prompts(questions, {
      onCancel() {
        console.log("")
        log.error("Creating project failed\n", true)
        process.exit(0)
      }
    })

    if (!args.name) args.name = values.name || "ulka-static-site"

    if (!args.installer) {
      args.installer = values.installer === 1 ? "yarn" : "npm"
    }

    if (!args.template) {
      args.template = values.template
    }

    await createProject(args)
  } catch (e) {
    console.log(`${e.message}\n`)
    log.error("Creating project failed. Please try again.")
    process.exit(0)
  }
}

/**
 * @param {Object} param0
 */
async function createProject({ template, name, installer }) {
  if (!template || !name || !installer) {
    console.log("")
    log.error("Creating project failed.\n", true)
    log.normal("Please try again: ")
    log.info("ulka create project_name ulkajs/ulka-starter-default -i npm")
    process.exit(0)
  }

  if (!template.startsWith("https://")) {
    template = "https://github.com/" + template
  }

  console.log("")
  log.info("Validating the starter template")
  const stop = spinner()

  try {
    const fetchUrl = GitHost.fromUrl(template).file("package.json")

    const response = await fetch(fetchUrl)

    const data = await response.json()

    if (!data.dependencies || !data.dependencies.ulka) {
      console.log("")
      log.error(`The provided ${template} is not a valid starter url\n`, true)
      console.log(
        `  · The given starter ${template} doesn't have ulka as a dependency.`
      )

      process.exit(0)
    }
  } catch (e) {
    console.log("")
    if (e.type === "invalid-json") {
      log.error(`The provided ${template} is not a valid starter url\n`, true)
      console.log(
        `  · Either the ${template} doesn't exist\n  · OR ${template} doesn't have package.json\n`
      )
    } else {
      log.error(e.message, true)
    }
    process.exit(0)
  }

  stop()

  try {
    console.log("")
    log.info("Cloning project from github.\n")

    execSync(`git clone ${template} ${name}`, {
      stdio: [0, 1, 2]
    })

    console.log("")
    log.info("Installing dependencies...\n")

    if (installer === "yarn") {
      unlinkSync(path.join(name, "package-lock.json"))
    }

    execSync(`cd ${name} && ${installer} install`, {
      stdio: [0, 1, 2]
    })

    rmdir(path.join(name, ".git"))

    console.log("")
    log.success("Completed\n")

    log.success(`cd ${name}`)
    log.success(`npm develop`)
  } catch (e) {
    console.log("")
    log.error("Creating project failed", true)
    process.exit(0)
  }
}

module.exports = create
