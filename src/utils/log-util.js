const chalk = require("chalk")

const log = {
  normal: str => {
    console.log(chalk.bold(">> "), str)
  },
  warning: (str, color = false) => {
    console.log(chalk.bold.yellow(">> "), color ? chalk.yellow(str) : str)
  },
  error: (str, color = false) => {
    console.log(chalk.bold.red(">> "), color ? chalk.red(str) : str)
  },
  success: (str, color = false) => {
    console.log(chalk.bold.green(">> "), color ? chalk.green(str) : str)
  },
  info: (str, color = false) => {
    console.log(chalk.bold.blue(">> "), color ? chalk.blue(str) : str)
  }
}

module.exports = log
