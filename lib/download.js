/*
 * @Author: YogurtQ
 * @Date: 2020-12-04 13:48:30
 * @LastEditors: YogurtQ
 * @LastEditTime: 2021-10-08 15:37:07
 * @Description: dowmload from url
 * @FilePath: \q-temp\lib\download.js
 */

const ora = require('ora')
const logSymbols = require("log-symbols")
const shell = require('shelljs')
const pico = require('picocolors')
const { execSync } = require("child_process")

module.exports = async function (projectName, url) {
  try {
    const cmdStr = `git clone ${url} ${projectName} && cd ${projectName} && git checkout master`
    const spinner = ora(`Downloading from ${url} ...`)
    
    spinner.start()
    execSync(cmdStr)
    spinner.succeed('Download complete.')

    const pwd = shell.pwd()
    await shell.rm('-rf', pwd + `/${projectName}/.git`)
  } catch (error) {
    console.error(error)
    console.error(logSymbols.error, pico.red(error.message))
    process.exit(1) 
  }
}
