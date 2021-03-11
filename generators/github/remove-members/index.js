const githubGenerator = require("../gh-base");

module.exports = class extends githubGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};

    this._makeMembersPromptOpt();
    this._makeTeamSlugPromptOpt();
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'Team Remover'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = this._makeConfig(this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if(props.members == '-') {
        props.members = []
      } else {
        props.members = props.members.split(',');
      }
      if(props.slug == '-') { props.slug = ''; }
      this.answers = props;
      this.data = this._makeConfig(this.initialData, this.answers);
    });
  }

  configuring() {
    this.membersConfig = {
      org: this.org,
    };
  }

  installing() {
    this.log('================\nLets remove some folks from the Labs org.');
    (async () => {
      if(this.data.slug != '') {
        const conf = this._makeConfig({team_slug: this.data.slug }, this.membersConfig);
        const members = await this.octokit.teams.listMembersInOrg(conf);
        for(let mem of members.data) {
          const roleConf = this._makeConfig({username: mem.login}, conf);
          const role = await this.octokit.teams.getMembershipForUserInOrg(roleConf);
          if(role.data.role == 'member') {
            this.data.members.push(mem.login)
          }
        }
      }
      for(let handle of this.data.members) {
        const opts = _makeConfig({username: handle}, this.membersConfig);
        await this.octokit.orgs.removeMembershipForUser(opts);
        this.log(`removed ${handle}`)
      }
    })();
  }
}