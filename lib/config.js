/*
 * @Author: YogurtQ
 * @Date: 2020-12-04 16:25:11
 * @LastEditors: YogurtQ
 * @LastEditTime: 2020-12-09 21:46:10
 * @Description: configurations
 * @FilePath: \q-temp\lib\config.js
 */

const fs = require('fs-extra')
const path = require('path')
const homedir = require('os').homedir()

const file = path.resolve(homedir, '.qtemprc')
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({}, null, 2), 'utf-8')
}

const config = fs.readJsonSync(file)

function get(key) {
  return config[key]
}

async function set(key, value) {
  try {
    config[key] = value
    await fs.writeFile(file, JSON.stringify(config, null , 2), 'utf-8')
    return true
  } catch (error) {
    throw new Error(`Error writing file ${file} \n ${error}`)
  }
}

async function unset(key) {
  try {
    if (config.hasOwnProperty(key)) {
      delete config[key]
    }
    await fs.writeFile(file, JSON.stringify(config, null, 2), 'utf-8')
    return true
  } catch (error) {
    throw new Error(`Error writing file ${file} \n ${error}`)
  }
}

module.exports = {
  get, set, unset
}
