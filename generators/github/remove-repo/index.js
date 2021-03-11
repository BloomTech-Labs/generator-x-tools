const githubGenerator = require("../gh-base");

module.exports = class extends githubGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};

    this._makeRepoPromptOpt();
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'Repo Remover'
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
    this.log(`Removing repo ${this.klr.bold(
      this.data.repo
    )}`);
  }

  writing() {
    (async () => {
      const repo = await this.octokit.repos.delete({
        owner: this.org,
        repo: this.data.repo,
      });
      this.log(`================\nRemoved repo ${repo.url}.\n`);
    })();
  }
};