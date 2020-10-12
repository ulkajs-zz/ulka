const prompts = require("prompts")
const { execSync } = require("child_process")
const log = require("../utils/ulka-log")
const { rmdir } = require("../utils/ulka-fs")
const path = require("path")

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
        type: "text"
      })
    }

    questions.push({
      name: "installer",
      message: "Choose installer",
      choices: ["npm", "yarn"],
      type: "select"
    })

    const values = await prompts(questions, {
      onCancel() {
        console.log("")
        log.error("Creating project failed\n", true)
        process.exit(0)
      }
    })

    if (!args.name) args.name = values.name || ""

    args.installer = values.installer === 1 ? "yarn" : "npm"

    if (!args.template)
      args.template = "https://github.com/ulkajs/ulka-starter-default"

    createProject(args)
  } catch (e) {
    console.log(`${e.message}\n`)
    log.error("Creating project failed. Please try again.")
    process.exit(0)
  }
}

/**
 * @param {Object} param0
 */
function createProject({ template, name, installer }) {
  try {
    console.log("")
    log.info("Cloning project from github.\n")

    execSync(`git clone ${template} ${name}`, {
      stdio: [0, 1, 2]
    })

    console.log("")
    log.info("Installing dependencies...\n")

    execSync(`cd ${name} && ${installer} install`, {
      stdio: [0, 1, 2]
    })

    rmdir(path.join(name, ".git"))

    console.log("")
    log.success("Completed\n")

    log.success(`cd ${name}`, true)
    log.success(`npm develop`, true)
  } catch (e) {
    console.log("")
    log.error("Creating project failed", true)
    process.exit(0)
  }
}

module.exports = create
