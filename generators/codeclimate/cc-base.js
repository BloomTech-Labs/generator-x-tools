const LabsGenerator = require('../labs-generator')
const fetch = require('node-fetch');

class ccClient {
  constructor(opts) {
    if(!opts.token) { throw new Error("missing CodeClimate api token option") }
    this.options =  Object.assign({
      base_url: 'https://api.codeclimate.com/v1',
      ver: "/v1"
    }, opts);
    this.headers = {
      "Authorization": `Token token=${opts.token}`,
      "Content-Type": "application/vnd.api+json",
      "Accept": "application/vnd.api+json"
    }
  }

  async request(path = "", options = {}) {
    const url = this.options.base_url + path

    const config = {
      ...options,
      headers: this.headers
    }

    const res = await fetch(url, config);
    return await res.json();
  }

  get(path) {
    return this.request(path);
  }

  post(path, body) {
    console.log(JSON.stringify(body));
    const opts = {
      body: JSON.stringify(body),
      method: 'POST'
    }
    return this.request(path, opts);
  }
}
module.exports = class extends LabsGenerator {
  team = "lambda-school-labs";

  constructor(args, opts) {
    super(args, opts);
    const ccOpts = { 
      token: process.env.CODECLIMATE_API_TOKEN, 
      debug: (process.env.CCDEBUG == 'true') 
    };
    this.client = new ccClient(ccOpts);
  }
}