/*
 * @Author: YogurtQ
 * @Date: 2020-12-08 11:31:43
 * @LastEditors: YogurtQ
 * @LastEditTime: 2021-05-16 11:20:45
 * @Description: file content
 * @FilePath: \q-temp\lib\repository.js
 */

const chalk = require('chalk')
const inquirer = require('inquirer')
const config = require('./config')

async function repository(value, options) {
  const repository = config.get('repository') || {}

  if (!options.add && !options.delete && !options.update) {
    const repoNames = Object.keys(repository)
    if (repoNames.length === 0) {
      console.log(chalk.yellow('There is no repository.'))
      console.log(`Run ${chalk.cyan('qt repo -a <repository-name> <repository-address>')} to add a repository.\n`)
    } else {
      console.log('Existing Repositories: ')
      repoNames.forEach(name => {
        console.log(`  ${chalk.blue(name)}: ${repository[name]}`)
      })
      console.log(`\nYou can use '${chalk.cyan('qt create <project-name> -r <repository-name>')}' to create a project.\n`);
    }
  }

  if (options.add && !value) {
    console.log(chalk.red(`Make sure you provide a name and a correct url for the option ${options.add}.`))
  }

  if (options.add && value) {
    const name = options.add
    if (repository[name]) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `The repository ${chalk.cyan(name)} already exits. Do you want to overwrite it?`
        }
      ])
      if (!ok) {
        return false
      }
    }
    repository[name] = value
    await config.set('repository', repository)
    console.log(`You have added the repository: ${chalk.cyan(name)}.`)
  }

  if (options.delete) {
    const name = options.delete
    if (!repository[name]) {
      console.log(chalk.red(`The repository ${chalk.cyan(name)} doesn't exit.`))
      return false;
    }
    delete repository[name]
    await config.set('repository', repository)
    console.log(`You have deleted the repository: ${chalk.cyan(name)}.`)
  }

  if (options.update) {
    const name = options.update
    if (!repository[name]) {
      console.log(chalk.red(`The repository ${chalk.cyan(name)} doesn't exit.`))
      return false;
    }
    repository[name] = value
    await config.set('repository', repository)
    console.log(`You have updated the repository ${chalk.cyan(name)} to ${chalk.cyan(value)}.`)
  }
}

module.exports = (...args) => {
  return repository(...args).catch(err => {
    console.error(err)
  })
}
