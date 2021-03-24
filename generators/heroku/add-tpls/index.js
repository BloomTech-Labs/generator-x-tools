const HerokuGenerator = require('../heroku-base');

module.exports = class extends HerokuGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};

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
        'Heroku TPL Adder'
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
  
  installing() {
    this.log('================\nLets invite some TPLs to Heroku.');
    const opts = {
      body: {
        role: 'admin'
      }
    };
    
    (async () => {
        for (const email of this.data.members) {
          try {
            opts.body.email = email;
            const obj = await this.hkClient.put(`/teams/${this.team}/invitations`, opts);
            this.log(`Added admin member ${email}`);
          } catch(err) {
            this.log(err.body.message);
          }
        }
    })();
  }
};
/*

*/