/*
 * @Author: YogurtQ
 * @Date: 2020-12-08 11:31:43
 * @LastEditors: YogurtQ
 * @LastEditTime: 2021-10-08 15:45:04
 * @Description: file content
 * @FilePath: \q-temp\lib\repository.js
 */

const pico = require('picocolors')
const inquirer = require('inquirer')
const config = require('./config')

async function repository(value, options) {
  const repository = config.get('repository') || {}

  if (!options.add && !options.delete && !options.update) {
    const repoNames = Object.keys(repository)
    if (repoNames.length === 0) {
      console.log(pico.yellow('There is no repository.'))
      console.log(`Run ${pico.cyan('qt repo -a <repository-name> <repository-address>')} to add a repository.\n`)
    } else {
      console.log('Existing Repositories: ')
      repoNames.forEach(name => {
        console.log(`  ${pico.blue(name)}: ${repository[name]}`)
      })
      console.log(`\nYou can use '${pico.cyan('qt create <project-name> -r <repository-name>')}' to create a project.\n`);
    }
  }

  if (options.add && !value) {
    console.log(pico.red(`Make sure you provide a name and a correct url for the option ${options.add}.`))
  }

  if (options.add && value) {
    const name = options.add
    if (repository[name]) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `The repository ${pico.cyan(name)} already exists. Do you want to overwrite it?`
        }
      ])
      if (!ok) {
        return false
      }
    }
    repository[name] = value
    await config.set('repository', repository)
    console.log(`You have added the repository: ${pico.cyan(name)}.`)
  }

  if (options.delete) {
    const name = options.delete
    if (!repository[name]) {
      console.log(pico.red(`The repository ${pico.cyan(name)} doesn't exist.`))
      return false;
    }
    delete repository[name]
    await config.set('repository', repository)
    console.log(`You have deleted the repository: ${pico.cyan(name)}.`)
  }

  if (options.update) {
    const name = options.update
    if (!repository[name]) {
      console.log(pico.red(`The repository ${pico.cyan(name)} doesn't exist.`))
      return false;
    }
    repository[name] = value
    await config.set('repository', repository)
    console.log(`You have updated the repository ${pico.cyan(name)} to ${pico.cyan(value)}.`)
  }
}

module.exports = (...args) => {
  return repository(...args).catch(err => {
    console.error(err)
  })
}
