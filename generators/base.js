const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env');
const result = require('dotenv').config({ path: envPath })
if (result.error) {
  throw result.error
}

exports.fs = fs;
exports.BaseGenerator = require('@lambdalabs/base-generator');
exports.pkg = require('../package.json');
exports.klr = require('kleur');

exports._inspect = (obj, level = 0) => {
  var spaces = "";
  for (var i = 0; i < level; i++) { spaces += " "; }
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object') {
        console.log(spaces + exports.klr.bold(prop) + ':');
        this._inspect(obj[prop], level + 2);
      } else {
        console.log(`${spaces}${exports.klr.bold(prop)}: ${obj[prop]}`)
      }
    }
  }
}

exports._exit = (code, msg) => {
  console.error(`Error: ${msg}`);
  process.exit(code);
}

exports._makeConfig = (config, custom={}) => {
  return Object.assign({}, config, custom)
}
