/*
 * @Author: QY
 * @Date: 2020-12-04 16:25:11
 * @LastEditors: QY
 * @LastEditTime: 2020-12-07 22:59:34
 * @Description: configurations
 * @FilePath: \q-temp\lib\config.js
 */

const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const homedir = require('os').homedir()

async function configure(value, options) {
  const file = path.resolve(homedir, '.qtemprc')
  if (!fs.existsSync(file)) {
    console.log(' The config file doesn\'t exist.')
    console.log(` You can run ${chalk.cyan('qt config -a')} to add a repository.`)
    process.exit(1)
  }

  const config = await fs.readJson(file)

  if (!options.add && !options.delete && !options.update) {
    console.log('Resolved path: ' + file + '\n', JSON.stringify(config, null, 2))
  }

  if (options.add && !value) {
    console.log(chalk.red(`Make sure you provide a name and a correct url for the option ${options.set}`))
  }

  if (options.add && value) {
    set(config, options.set, value)

    await fs.writeFile(file, JSON.stringify(config, null, 2), 'utf-8')
    if (options.json) {
      console.log(JSON.stringify({
        updated: options.set
      }))
    } else {
      console.log(`You have updated the url: ${options.set} to ${value}`)
    }
  }

  if (options.delete) {
    unset(config, options.delete)
    await fs.writeFile(file, JSON.stringify(config, null, 2), 'utf-8')
    if (options.json) {
      console.log(JSON.stringify({
        deleted: options.delete
      }))
    } else {
      console.log(`You have removed the url: ${options.delete}`)
    }
  }

  if (options.update) {
    launch(file)
  }
}

module.exports = (...args) => {
  return configure(...args).catch(err => {
    console.error(err)
  })
}
