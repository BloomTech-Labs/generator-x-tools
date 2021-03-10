const {
  BaseGenerator,
  klr,
  octokit,
  _inspect,
  Github } = require("../gh-base");

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};

    this._makePromptOption(
      'repo',
      {
        type: 'input',
        message: 'What is the name of the repo?',
        store: true,
      },
      {
        type: String,
        alias: 'p',
        desc: 'name of the repo',
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.bold(
        'Repo Remover'
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
    this.log(`Configuring for repo ${klr.bold(
      this.data.repo
    )}`);
    // _inspect(this.data);
  }

  writing() {
    (async () => {
      const repo = await octokit.repos.delete({
        owner: Github.org,
        repo: this.data.repo,
      });
      // _inspect(repo);
      this.log(`================\nRemoved repo ${repo.url}.\n`);
    })();
  }
};