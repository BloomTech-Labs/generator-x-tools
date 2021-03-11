const githubGenerator = require("../gh-base");

module.exports = class extends githubGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};

    this._makeTeamSlugsPromptOpt();
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.bold(
        'Team Remover'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = this._makeConfig(this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if(props.teamSlugs) {
        props.teamSlugs = props.teamSlugs.split(',');
      }
      this.answers = props;
      this.data = this._makeConfig(this.initialData, this.answers);
    });
  }

  configuring() {
    this.teamConfig = {
      org: this.org,
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
          org: this.org,
          team_slug: team,
        }
        // delete members
        await this._deleteMembers(conf);
        // delete team
        await this.octokit.teams.deleteInOrg(conf);
        this.log(this.klr.red(`[======== Deleted team ${this.klr.bold(team)}`));
      }
    })();
  }

  async _deleteMembers(conf) {
    const members = await this.octokit.teams.listMembersInOrg(conf);
    const logins = [];
    for(let mem of members.data) {
      const memConf = this._makeConfig({username: mem.login}, conf);
      const role = await this.octokit.teams.getMembershipForUserInOrg(memConf);
      if(role.data.role == 'member') {
        logins.push(mem.login)
      }
    }
    for(const handle of logins) {
      const opts = this._makeConfig({username: handle}, this.teamConfig);
      await this.octokit.orgs.removeMembershipForUser(opts);
      this.log(`removed user: ${handle}`)
    }
  }
}