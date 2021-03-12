const LabsGenerator = require("../labs-generator");
const HerokuClient = require('heroku-client');

module.exports = class extends LabsGenerator {
  team = "lambda-school-labs";

  constructor(args, opts) {
    super(args, opts);
    const hkOpts = { 
      token: process.env.HEROKU_API_TOKEN, 
      debug: (process.env.HKDEBUG == 'true') 
    };
    this.hkClient = new HerokuClient(hkOpts);
  }
}
