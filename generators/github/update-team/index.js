const githubGenerator = require("../gh-base");

module.exports = class extends githubGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.team = {};

    this._makeReposPromptOpt();
    this._makeMaintainersPromptOpt();
    this._makeMembersPromptOpt();
    this._makeTeamSlugPromptOpt();
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'Team Updater'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = this._makeConfig(this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if(props.members && props.members != '-') { props.members = props.members.split(','); } else { props.members = []; }
      if(props.maintainers && props.maintainers != '-') { props.maintainers = props.maintainers.split(','); } else { props.maintainers = []; }
      if(props.repos && props.props != '-') { props.repos = props.repos.split(','); } else { props.repos = []; }
      this.answers = props;
      this.data = this._makeConfig(this.initialData, this.answers);
    });
  }

  configuring() {
    if(this.data.t) {
      this.data.slug = this.data.t;
    }
    if(this.data.r && this.data.r != '-') {
      this.data.repos = this.data.r.split(',');
    }
    if(this.data.b && this.data.b != '-') {
      this.data.members = this.data.m.split(',');
    }
    if(this.data.m && this.data.m != '-') {
      this.data.maintainers = this.data.m.split(',');
    }
    this.teamConfig = {
      org: this.org,
      team_slug: this.data.slug,
    };
  }

  // https://github.com/Lambda-School-Labs/LabsPT15-cityspire-g-fe.git
  writing() {
    this.log(`[== Updating Team ${this.data.slug}`);
    (async () => {
      // add members
      for (var member of this.data.members) {
        this.octokit.teams.addOrUpdateMembershipForUserInOrg(
          this._makeConfig(this.teamConfig, { username: member, role: 'member' })
        );
        this.log(`[==== Member Added ${member}`)
      }
      // add maintainers
      for (var maintainer of this.data.maintainers) {
        this.octokit.teams.addOrUpdateMembershipForUserInOrg(
          this._makeConfig(this.teamConfig, { username: maintainer, role: 'maintainer' })
        );
        this.log(`[==== Maintainer Added ${maintainer}`)
      }
      // add repos
      for (var repo of this.data.repos) {
        this.octokit.teams.addOrUpdateRepoPermissionsInOrg(
          this._makeConfig(this.teamConfig, {
            repo,
            owner: this.org,
            permission: 'push'
          })
        );
        this.log(`[==== Repo Added ${repo}`)
      }
    })();
  }
}
