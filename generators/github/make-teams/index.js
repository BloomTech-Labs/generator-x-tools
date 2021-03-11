const githubGenerator = require("../gh-base");

module.exports = class extends githubGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.newTeams = {};

    this._makeProductPromptOpt();
    this._makeCohortPromptOpt();
    this._makeTeamCountPromptOpt();

  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'Team Maker'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = this._makeConfig(this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      this.answers = props;
      this.data = this._makeConfig(this.initialData, this.answers);
    });
  }

  configuring() {
    for (var i = 0; i < this.data.teams; i++) {
      const letter = String.fromCharCode(97 + i)
      this.newTeams[letter] = {
        name: this._makeTeamName(this.data.cohort, this.data.product, letter)
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
        const teamObj = await this.octokit.teams.create(
          this._makeConfig({
              name,
              org: this.org,
              privacy: 'closed',
              description: `Labs ${this.data.cohort}, team ${team.toUpperCase()} for project ${this.data.product}`,
            })
        );
        this.log(`================\nCreated the new github team ${name} (slug: ${teamObj.data.slug}).`);
      }
    })();
  }

  end() {
    // clean up

  }
}