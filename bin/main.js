#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const minimist = require('minimist')

program
  .name('qt')
  .version(`version ${require('../package').version}`, '-v, --version')
  .usage('<command>')

program
  .command('create <project-name>')
  .description('create a new project from a template repository default or you provided')
  .option('-u, --url <address>', 'Provide a repository url')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .option('-m, --merge', 'Merge target directory if it exists')
  .action((name, cmd) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }

    require('../lib/create')(name, cleanArgs(cmd))
  })

program
  .command('config')
  .description('set configurations')
  .option('-a, --add <name> <address>', 'add url')
  .option('-d, --delete <name>', 'delete url by name')
  .option('-u, --update <name> <address>', 'update url by name')
  .action((cmd) => {
    require('../lib/config')(cleanArgs(cmd))
  })

// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
    suggestCommands(cmd)
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`qt <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function suggestCommands (unknownCommand) {
  const availableCommands = program.commands.map(cmd => cmd._name)

  let suggestion

  availableCommands.forEach(cmd => {
    const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand)
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd
    }
  })

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`))
  }
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
