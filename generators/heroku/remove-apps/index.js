const HerokuGenerator = require('../heroku-base');

module.exports = class extends HerokuGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.newApps = {};

    this._makePromptOption(
      'apps',
      {
        type: 'input',
        message: 'What are the app names? (app-name-1,app-name-2)',
        store: true,
      },
      {
        type: String,
        alias: 't',
        desc: 'comma list of app names? (app-name-1,app-name-2)',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'BE App Remover'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = Object.assign({}, this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if (props.apps == '-') {
        props.apps = [];
      } else {
        props.apps = props.apps.split(',');
      }
      this.answers = props;
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {}

  installing() {
    this.log('================\nLets remove some apps from Heroku.');
    (async () => {
        try {
            for (var app of this.data.apps) {
              await this.hkClient.delete(`/apps/${app}`);
            }
          } catch(err) {
            this.log(err);
          }
    })();
  }
};
