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
      'members',
      {
        type: 'input',
        message: 'What are the member github handles? (handle1,handle2)',
        store: true,
      },
      {
        type: String,
        alias: 't',
        desc: 'comma list of member github handles? (handle1,handle2)',
      }
    );
    this._makePromptOption(
      'team',
      {
        type: 'input',
        message: 'What is the team slug? (ft32-cityspire-c)',
        store: true,
      },
      {
        type: String,
        alias: 't',
        desc: 'the team slug? (ft32-cityspire-c)',
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
      if(props.members == '-') {
        props.members = []
      } else {
        props.members = props.members.split(',');
      }
      if(props.team == '-') { props.team = ''; }
      this.answers = props;
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {
    this.membersConfig = {
      org: Github.org,
    };
  }

  installing() {
    this.log('================\nLets remove some folks from the Labs org.');
    (async () => {
      if(this.data.team != '') {
        const conf = _makeConfig({team_slug: this.data.team }, this.membersConfig);
        const members = await octokit.teams.listMembersInOrg(conf);
        for(let mem of members.data) {
          const roleConf = _makeConfig({username: mem.login}, conf);
          const role = await octokit.teams.getMembershipForUserInOrg(roleConf);
          if(role.data.role == 'member') {
            this.data.members.push(mem.login)
          }
        }
      }
      for(let handle of this.data.members) {
        const opts = _makeConfig({username: handle}, this.membersConfig);
        await octokit.orgs.removeMembershipForUser(opts);
        this.log(`removed ${handle}`)
      }
    })();
  }
}