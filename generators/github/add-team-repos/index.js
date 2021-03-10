const {
  BaseGenerator,
  klr,
  octokit,
  _inspect,
  _makeConfig,
  Github } = require("../gh-base");

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    
    this._makePromptOption(
      'product',
      {
        type: 'input',
        message: 'What is the name of the product used to create repos?',
        store: true,
      },
      {
        type: String,
        alias: 'p',
        desc: 'name of the product used to create repos',
      }
    );
    this._makePromptOption(
      'letter',
      {
        type: 'input',
        message: 'What is the letter of the team?',
        store: true,
      },
      {
        type: String,
        alias: 't',
        desc: 'team letter',
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
      'repos',
      {
        type: 'checkbox',
        message: 'What type of repos?',
        choices: [
          {
            name: 'Frontend',
            value: 'fe',
            checked: true,
          },
          {
            name: 'Backend',
            value: 'be',
            checked: true,
          },
          {
            name: 'Datascience',
            value: 'ds',
          },
          {
            name: 'iOS',
            value: 'ios',
          },
        ],
        store: true,
      },
      {
        type: String,
        alias: 'r',
        desc: 'comma list of repo types',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.bold(
        'Team Repo adder-on-er'
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
    this.teamSlug = Github.makeTeamSlug(this.data.cohort, this.data.product, this.data.letter);
    this.repos = this.data.repos.map((repoType) => {
      return Github.makeRepoName(this.data.cohort, this.data.product, this.data.letter, repoType);
    });
    this.teamConfig = {
      org: Github.org,
      team_slug: this.teamSlug,
      owner: Github.org,
      permission: 'push'
    };
  }

  installing() {
    this.log(`================\nLets add some repos to team ${this.teamSlug}.`);
    (async () => {
      this.repos.forEach((repo) => {
        octokit.teams.addOrUpdateRepoPermissionsInOrg(
          _makeConfig(this.teamConfig, { repo })
        );
        this.log(`[==== Repo Added ${repo}`)
      });
    })();
  }

  end() {
    // clean up

  }
}