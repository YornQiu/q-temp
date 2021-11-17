/*
 * @Author: YornQiu
 * @Date: 2020-12-04 16:00:23
 * @LastEditors: YornQiu
 * @LastEditTime: 2021-10-08 15:44:47
 * @Description: create project
 * @FilePath: \q-temp\lib\create.js
 */

const path = require('path')
const fs = require('fs-extra')
const pico = require('picocolors')
const inquirer = require('inquirer')
const validateProjectName = require('validate-npm-package-name')
const logSymbols = require("log-symbols")
const download = require('./download')
const config = require('./config')

async function create (projectName, options) {

  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')

  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(pico.red(`Invalid project name: '${name}'`))
    result.errors && result.errors.forEach(err => {
      console.error(pico.red('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(pico.red('Warning: ' + warn))
    })
    process.exit(1)
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
            message: `Target directory ${pico.cyan(targetDir)} already exists. Pick an action:`,
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
          console.log(`\nRemoving ${pico.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

  let url = 'https://github.com/YornQiu/vue-template.git'
  const repository = config.get('repository')

  if (!options.repo && !options.url && Object.keys(repository).length) {
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
 
  if (options.repo) {
    if (!repository[options.repo]) {
      console.log(pico.red(`The repository ${pico.cyan(options.repo)} doesn't exist.`))
      return
    } else {
      url = repository[options.repo]
    }
  }
  
  if (options.url) {
    url = options.url
  }
  
  if(!/^((http|https):\/\/)?(((([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+))|((\d+\.){3}\d+))[/\?\:]?.*$/.test(url)) {
    console.error(pico.red(`Invalid url: '${url}'`))
    process.exit(1)
  }

  await download(projectName, url)

  // update project name in package.json
  const pkgFile = path.resolve(targetDir, 'package.json')
  if (fs.existsSync(pkgFile)) {
    const pkgJson = await fs.readJson(pkgFile)
    pkgJson.name = projectName
    fs.writeFileSync(pkgFile, JSON.stringify(pkgJson, null , 2), 'utf-8')
  }

  console.log(logSymbols.success, pico.green('Successed!'))
  console.log(pico.green(`Now you can run: 'cd ${projectName}' and 'npm install' to initialize the project.`))
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    console.error(err)
    process.exit(1)
  })
}
