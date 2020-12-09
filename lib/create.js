/*
 * @Author: QY
 * @Date: 2020-12-04 16:00:23
 * @LastEditors: QY
 * @LastEditTime: 2020-12-09 21:46:23
 * @Description: create project
 * @FilePath: \q-temp\lib\create.js
 */

const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const validateProjectName = require('validate-npm-package-name')
const download = require('./download')
const config = require('./config')

async function create (projectName, options) {

  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')

  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: '${name}'`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    exit(1)
  }

  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate project in current directory?`
          }
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Merge', value: 'merge' },
              { name: 'Cancel', value: false }
            ]
          }
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

  let url = 'https://github.com/yogurtq/vue-template.git'
  const repository = config.get('repository')

  if (!options.rep && !options.url && Object.keys(repository).length) {
    const { address } = await inquirer.prompt([
      {
        name: 'address',
        type: 'list',
        message: `You do not provide a repository or a url. And you can choose one from config file or use default:`,
        choices: Object.keys(repository).map(r => ({
          name: r, value: repository[r]
        })).concat([{ name:'default', value: false }])
      }
    ])
    if (address) {
      url = address
    }
  }
 
  if (options.rep) {
    if (!repository[options.rep]) {
      console.log(chalk.red(`The repository ${chalk.cyan(options.rep)} doesn't exit.`))
      return
    } else {
      url = repository[options.rep]
    }
  }
  
  if (options.url) {
    url = options.url
  }
  
  if(!/^((http|https):\/\/)?(((([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+))|((\d+\.){3}\d+))[/\?\:]?.*$/.test(url)) {
    console.error(chalk.red(`Invalid url: '${url}'`))
    process.exit(1)
  }
  await download(projectName, url)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    console.error(err)
    process.exit(1)
  })
}
