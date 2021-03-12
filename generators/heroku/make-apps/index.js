const HerokuGenerator = require("../heroku-base");

  // make app
  // update deploy

module.exports = class extends HerokuGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.newApps = {};

    this._makePromptOption(
      'product',
      {
        type: 'input',
        message: 'What is the name of the product or abbreviated name?',
        store: true,
      },
      {
        type: String,
        alias: 'p',
        desc: 'name of the product',
      }
    );
    this._makePromptOption(
      'teams',
      {
        type: 'number',
        message: 'How many teams for the product?',
        store: true,
      },
      {
        type: String,
        alias: 't',
        type: 'Number',
        desc: 'team count',
      }
    );
    this._makePromptOption(
      'cohort',
      {
        type: 'input',
        message: 'What is the Labs cohort? (FT32, PT18)',
        store: true,
      },
      {
        type: String,
        alias: 'l',
        desc: 'labs cohort number (FT32, PT18)',
      }
    );
    this._makePromptOption(
      'oktaId',
      {
        type: 'input',
        message: 'What is the Okta Client ID? (0oaiurhf9fhHIUx7)',
        store: true,
      },
      {
        type: String,
        alias: 'o',
        desc: 'Okta Client ID (0oaiurhf9fhHIUx7)',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'API App Maker'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = this._makeConfig(this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if (props.product) { props.product = props.product.replace(/\s/g, '-'); }
      this.answers = props;
      this.data = this._makeConfig(this.initialData, this.answers);
    });
  }

  configuring() {
    // API only currently
    this.newApps = this._makeAppObjects(this.data.cohort, this.data.product, this.data.teams, 'api');
  }

  installing() {
    const opts = {
      body: {
        stack: 'heroku-20',
        region: 'us',
        team: this.team,
        name: ''
      }
    };
    const dbOpts = {
      body: {
        plan: 'heroku-postgresql:hobby-dev'
      }
    };
    const configVars = {
      NODE_TLS_REJECT_UNAUTHORIZED: 0,
      OKTA_CLIENT_ID: this.data.oktaId,
      OKTA_URL_ISSUER: 'https://auth.lambdalabs.dev/oauth2/default'
    };
    (async () => {
      try {

        for (var a in this.newApps) {
          opts.body.name = this.newApps[a].name;
          this.log(`===============]\nMake app: ${opts.body.name}`);
          const app = await this.hkClient.post('/teams/apps', opts)
          this.log(`|====== Add DB`);
          await this.hkClient.post(`/apps/${app.id}/addons`, dbOpts);
          const vars = await this.hkClient.get(`/apps/${app.id}/config-vars`);
          const newVars = this._makeConfig(vars, configVars);
          this.log(`|====== Add Config Vars`);
          await this.hkClient.patch(`/apps/${app.id}/config-vars`, {body: newVars});
        }
      } catch(err) {
        this.log(err);
      }
    })();
    
  }

}