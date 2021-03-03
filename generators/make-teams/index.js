const {
  BaseGenerator,
  klr,
  octokit,
  _inspect,
  ghConfig } = require("../gh-base");

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.newTeams = {};

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
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.bold(
        'Team Maker'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = Object.assign({}, this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      this.answers = props;
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {
    for (var i = 0; i < this.data.teams; i++) {
      const letter = String.fromCharCode(97 + i)
      this.newTeams[letter] = {
        name: `${this.data.cohort} - ${this.data.product} - ${letter}`
      };
    }
    // _inspect(this.newTeams);
  }

  writing() {

  }

  installing() {
    this.log('================\nLets make some teams.');
    (async () => {
      for (var team in this.newTeams) {
        const name = this.newTeams[team].name;
        // create new team
        const teamObj = await octokit.teams.create(
          Object.assign({},
            {
              name,
              org: ghConfig.org,
              privacy: 'closed',
              description: `Labs ${this.data.cohort}, team ${team.toUpperCase()} for project ${this.data.product}`,
            })
        );
        this.log(`================\nCreated the new github team ${name} (slug: ${teamObj.data.slug}).`);
        // _inspect(teamObj);
      }
    })();
  }

  end() {
    // clean up

  }
}