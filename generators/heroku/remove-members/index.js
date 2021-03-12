const HerokuGenerator = require('../heroku-base');

module.exports = class extends HerokuGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.newApps = {};

    this._makePromptOption(
      'members',
      {
        type: 'input',
        message: 'What are the members emails? (email1,email2)',
        store: true,
      },
      {
        type: String,
        alias: 'm',
        desc: 'comma list of members emails? (email1,email2)',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'Heroku Member Remover'
      )}!\nLets get started.`
    );
    this._removePrompts();
    if (this.options.m) {
      this.options.members = this.options.m.split(',');
    }
    this.initialData = this._makeConfig(this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if (props.members) {
        props.members = props.members.split(',');
      }
      this.answers = props;
      this.data = this._makeConfig(this.initialData, this.answers);
    });
  }

  configuring() {}

  installing() {
    this.log('================\nLets remove some members from Heroku.');
    (async () => {
        for (var email of this.data.members) {
          try {
            const obj = await this.hkClient.delete(`/teams/${this.team}/members/${email}`);
            this.log(`Removed member ${email}`);
          } catch(err) {
            this.log(err.message);
          }
        }
    })();
  }
};

/*
labs ./generators/heroku/remove-members -m=

*/