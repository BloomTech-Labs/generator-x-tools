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
      if(props.teamSlugs) {
        props.teamSlugs = props.teamSlugs.split(',');
      }
      this.answers = props;
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {
    this.teamConfig = {
      org: Github.org,
    };
    if(this.data.t) {
      this.data.teamSlugs = this.data.t.split(',');
    }
  }

  installing() {
    this.log('================\nLets delete some teams.');
    (async () => {
      for (var team of this.data.teamSlugs) {
        const conf = {
          org: Github.org,
          team_slug: team,
        }
        // delete members
        await this._deleteMembers(conf);
        // delete team
        await octokit.teams.deleteInOrg(conf);
        this.log(klr.red(`[======== Deleted team ${klr.bold(team)}`));
      }
    })();
  }

  async _deleteMembers(conf) {
    const members = await octokit.teams.listMembersInOrg(conf);
    const logins = [];
    for(let mem of members.data) {
      const memConf = _makeConfig({username: mem.login}, conf);
      const role = await octokit.teams.getMembershipForUserInOrg(memConf);
      if(role.data.role == 'member') {
        logins.push(mem.login)
      }
    }
    for(let handle of logins) {
      const opts = _makeConfig({username: handle}, this.teamConfig);
      await octokit.orgs.removeMembershipForUser(opts);
      this.log(`removed user: ${handle}`)
    }
  }
}