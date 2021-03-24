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
    this.initialData = this._makeConfig(this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if (props.apps == '-') {
        props.apps = [];
      } else {
        props.apps = props.apps.split(',');
      }
      this.answers = props;
      this.data = this._makeConfig(this.initialData, this.answers);
    });
  }

  configuring() {}

  installing() {
    this.log('================\nLets remove some apps from Heroku.');
    (async () => {
        try {
            for (var app of this.data.apps) {
              this.log(`${this.klr.red("Removing")} ${app}`);
              await this._deleteMembers({app, team: this.team})
              await this.hkClient.delete(`/apps/${app}`);
              this.log(`  > ${app} removed`);
            }
          } catch(err) {
            this.log(err);
          }
    })();
  }

  async _deleteMembers(conf) {
    const collaborators = await this.hkClient.get(`/apps/${conf.app}/collaborators`);
    for (const member of collaborators) {
      if(member.id != "4a1fc63b-129b-411f-a692-c93b50b0caf4") {
        const obj = await this.hkClient.delete(`/teams/${this.team}/members/${member.user.email}`);
        this.log(`  - removed ${member.user.email}`);
      }
    }
  }
};
