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
    this.team = {};

    this._makePromptOption(
      'slug',
      {
        type: 'input',
        message: 'What is the team slug? (pt17-city-spire-a)',
        store: true,
      },
      {
        type: String,
        alias: 't',
        desc: 'team slug (pt17-city-spire-a)',
      }
    );
    this._makePromptOption(
      'members',
      {
        type: 'input',
        message: 'Comma list of members github handles? (handle1,handle2)',
        store: true,
      },
      {
        type: String,
        alias: 'b',
        desc: 'comma list of members github handles (handle1,handle2)',
      }
    );
    this._makePromptOption(
      'maintainers',
      {
        type: 'input',
        message: 'Comma list of maintainers github handles? (handle1,handle2)',
        store: true,
      },
      {
        type: String,
        alias: 'm',
        desc: 'comma list of maintainers github handles (handle1,handle2)',
      }
    );
    this._makePromptOption(
      'repos',
      {
        type: 'input',
        message: 'Comma list of repo names? (repo1,repo2)',
        store: true,
      },
      {
        type: String,
        alias: 'r',
        desc: 'comma list of repo names? (repo1,repo2)',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.bold(
        'Team Updater'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = Object.assign({}, this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if(props.members && props.members != '-') { props.members = props.members.split(','); } else { props.members = []; }
      if(props.maintainers && props.maintainers != '-') { props.maintainers = props.maintainers.split(','); } else { props.maintainers = []; }
      if(props.repos && props.props != '-') { props.repos = props.repos.split(','); } else { props.repos = []; }
      this.answers = props;
      this.data = Object.assign({}, this.initialData, this.answers);
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
      org: Github.org,
      team_slug: this.data.slug,
    };
  }

  writing() {
    this.log(`[== Updating Team ${this.data.slug}`);
    (async () => {
      // add members
      for (var member of this.data.members) {
        octokit.teams.addOrUpdateMembershipForUserInOrg(
          _makeConfig(this.teamConfig, { username: member, role: 'member' })
        );
        this.log(`[==== Member Added ${member}`)
      }
      // add maintainers
      for (var maintainer of this.data.maintainers) {
        octokit.teams.addOrUpdateMembershipForUserInOrg(
          _makeConfig(this.teamConfig, { username: maintainer, role: 'maintainer' })
        );
        this.log(`[==== Maintainer Added ${maintainer}`)
      }
      // add repos
      for (var repo of this.data.repos) {
        octokit.teams.addOrUpdateRepoPermissionsInOrg(
          _makeConfig(this.teamConfig, {
            repo,
            owner: Github.org,
            permission: 'push'
          })
        );
        this.log(`[==== Repo Added ${repo}`)
      }
    })();
  }
}
// https://github.com/Lambda-School-Labs/LabsPT15-cityspire-g-fe.git
// 