const {
  BaseGenerator,
  klr,
  octokit,
  _inspect,
  _makeConfig,
  ghConfig } = require("../gh-base");

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.newTeams = {};

    this._makePromptOption(
      'teamSlugs',
      {
        type: 'input',
        message: 'What are the team slugs? (pt17-cityspire-c,pt17-merchantmarket-a)',
        store: true,
      },
      {
        type: String,
        alias: 't',
        desc: 'comma list of team slugs? (pt17-cityspire-c,pt17-merchantmarket-a)',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.bold(
        'Team Remover'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = Object.assign({}, this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      props.teamSlugs = props.teamSlugs.split(',');
      this.answers = props;
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {
    this.teamConfig = {
      org: ghConfig.org,
    };
  }

  installing() {
    this.log(this.data.teamSlugs)
    this.log('================\nLets delete some teams.');
    (async () => {
      for (var team of this.data.teamSlugs) {
        // delete team
        octokit.teams.deleteInOrg({
          org: ghConfig.org,
          team_slug: team,
        });
        this.log(`[======== Deleted team ${team}.`);
      }
    })();
  }
}