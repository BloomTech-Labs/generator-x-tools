const githubGenerator = require("../gh-base");

module.exports = class extends githubGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.newRepos = {};

    this._makeRepoUrlPromptOpt();
    this._makeProductPromptOpt();
    this._makeTeamCountPromptOpt();
    this._makeCohortPromptOpt();
    this._makerepoTypePromptOpts();
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'Repo Forker'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = this._makeConfig(this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if (props.product) { props.product = props.product.replace(/\s/g, ''); }
      this.answers = props;
      this.data = this._makeConfig(this.initialData, this.answers);
    });
  }

  configuring() {
    // validate the url
    // this.log(`url: ${this.data.url}`);
    if (!this.data.repoUrl) { this.exit(9, "missing repo url"); }
    const finds = this.data.repoUrl.match(/\/([\w-]*)\.git/i);
    // this.log(`finds: ${finds}`);
    if (!finds[1]) { _exit(9, "invalid repo url"); }
    if (fs.existsSync(finds[1])) { _exit(9, "Clone already exists"); }
    this.repoName = finds[1];

    this.log(`Configuring "Fork" for repo ${this.klr.bold(this.repoName)}`);
    for (var i = 0; i < this.data.teamCount; i++) {
      const letter = String.fromCharCode(97 + i)
      this.newRepos[letter] = { name: this._makeRepoName(this.data.cohort, this.data.product, letter, this.data.repoType) };
    }
  }

  writing() {
    // clone original repo
    this.log(`================\nClone the repo ${this.data.repoUrl}.\n`);
    this.spawnCommandSync('git', ['clone', this.data.repoUrl]);
    process.chdir(this.repoName);
  }

  installing() {
    (async () => {
      for (var team in this.newRepos) {
        const name = this.newRepos[team].name;
        const defaultOpts = this.conf.defaultRepoOpts;
        // create new repo
        const repo = await this.octokit.repos.createInOrg(
          this._makeConfig(defaultOpts,
            {
              name,
              description: `${this.data.product} project for Labs${this.data.cohort}`,
            })
        );
        this.octokit.repos.replaceAllTopics({
          owner: this.org,
          repo: name,
          names: [`labs${this.data.cohort.toLowerCase()}`],
        });
        this.newRepos[team].repo = repo;
        this.log(`================\nCreated the new github repo ${name}.`);
        // _inspect(repo.data);

        // fork to new repos
        const remoteName = `team${team.toUpperCase()}`
        this.log(`================\n"Forking" to new repo for ${name}.\n`);
        const repoUrl = `https://github.com/${this.org}/${name}.git`;
        this.spawnCommandSync('git', ['remote', 'add', remoteName, repoUrl]);
        this.spawnCommandSync('git', ['push', remoteName, 'main']);

        this.octokit.request("PUT /repos/{owner}/{repo}/branches/{branch}/protection", {
          mediaType: {
            previews: ["symmetra", "loki", "luke-cage"],
          },
          owner: this.org,
          repo: name,
          branch: 'main',
          enabled: true,
          enforce_admins: false,
          required_pull_request_reviews: {
            dismiss_stale_reviews: true,
            required_approving_review_count: 2,
          },
          restrictions: null,
          required_status_checks: {
            strict: true,
            contexts: ['Test and publish test coverage']
          }
        });
      }
      process.chdir('..');
      this.spawnCommandSync('rm', ['-rf', this.repoName]);
      this.log(`================\nRemoved cloned repo ${this.repoName}.\n`);
    })();
  }

  end() {
    // clean up

  }
}