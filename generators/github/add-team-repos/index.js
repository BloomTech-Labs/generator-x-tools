const githubGenerator = require("../gh-base");

module.exports = class extends githubGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    
    this._makeProductPromptOpt();
    this._makeCohortPromptOpt();
    this._makeRepoTypesPromptOpts();
    this._makeTeamLetterPromptOpt();
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'Team Repo adder-on-er'
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
    this.teamSlug = this._makeTeamSlug(this.data.cohort, this.data.product, this.data.letter);
    this.repos = this.data.repoTypes.map((repoType) => {
      return this._makeRepoName(this.data.cohort, this.data.product, this.data.letter, repoType);
    });
    this.teamConfig = {
      org: this.org,
      team_slug: this.teamSlug,
      owner: this.org,
      permission: 'push'
    };
  }

  installing() {
    this.log(`================\nLets add some repos to team ${this.teamSlug}.`);
    (async () => {
      this.repos.forEach((repo) => {
        this.octokit.teams.addOrUpdateRepoPermissionsInOrg(
          this._makeConfig(this.teamConfig, { repo })
        );
        this.log(`[==== Repo Added ${repo}`)
      });
    })();
  }

  end() {
    // clean up

  }
}