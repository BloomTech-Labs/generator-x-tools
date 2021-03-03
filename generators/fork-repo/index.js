const {
  BaseGenerator,
  fs,
  klr,
  octokit,
  _inspect,
  ghConfig } = require("../gh-base");

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};
    this.exit = (code, msg) => {
      console.error(`Error: ${msg}`);
      process.exit(code);
    }
    this.newRepos = {};

    this._makePromptOption(
      'url',
      {
        type: 'input',
        message: 'What is the URL of github repo to clone (HTTPS git url)?',
        store: true,
      },
      {
        type: String,
        alias: 'u',
        desc: 'URL of git repo to clone (HTTPS git url)',
      }
    );
    this._makePromptOption(
      'product',
      {
        type: 'input',
        message: 'What is the name of the product or abbreviated name?',
        store: true,
      },
      {
        type: String,
        alias: 'p',
        desc: 'name of the product',
      }
    );
    this._makePromptOption(
      'teams',
      {
        type: 'number',
        message: 'How many teams for the product?',
        store: true,
      },
      {
        type: String,
        alias: 't',
        type: 'Number',
        desc: 'team count',
      }
    );
    this._makePromptOption(
      'cohort',
      {
        type: 'input',
        message: 'What is the Labs cohort? (FT32, PT18)',
        store: true,
      },
      {
        type: String,
        alias: 'l',
        desc: 'labs cohort number (FT32, PT18)',
      }
    );
    this._makePromptOption(
      'purpose',
      {
        type: 'list',
        message: 'What will the repo be used for?',
        choices: [
          {
            name: 'Frontend',
            value: 'fe',
          },
          {
            name: 'Backend',
            value: 'be',
          },
          {
            name: 'Datascience',
            value: 'ds',
          },
          {
            name: 'iOS',
            value: 'ios',
          },
        ],
        store: true,
      },
      {
        type: String,
        alias: 'r',
        desc: 'repo purpose',
        store: true,
      }
    );
  }

  initializing() {
    this.log(
      `Welcome to the ${klr.red('Labs')} ${klr.bold(
        'Repo Forker'
      )}!\nLets get started.`
    );
    this._removePrompts();
    this.initialData = Object.assign({}, this.initialData, this.options);
  }

  prompting() {
    return this.prompt(this.prompts).then((props) => {
      if (props.product) { props.product = props.product.replace(/\s/g, ''); }
      this.answers = props;
      this.data = Object.assign({}, this.initialData, this.answers);
    });
  }

  configuring() {
    // validate the url
    // this.log(`url: ${this.data.url}`);
    if (!this.data.url) { this.exit(9, "missing repo url"); }
    const finds = this.data.url.match(/\/([\w-]*)\.git/i);
    // this.log(`finds: ${finds}`);
    if (!finds[1]) { this.exit(9, "invalid repo url"); }
    if (fs.existsSync(finds[1])) { this.exit(9, "Clone already exists"); }
    this.repoName = finds[1];

    this.log(`Configuring "Fork" for repo ${klr.bold(this.repoName)}`);
    // _inspect(this.data);
    const repoBaseName = this.data.cohort.toUpperCase() + "_" + this.data.product;
    for (var i = 0; i < this.data.teams; i++) {
      const letter = String.fromCharCode(97 + i)
      this.newRepos[letter] = {};
    }
    for (const team in this.newRepos) {
      const name = `${repoBaseName}-${team}-${this.data.purpose}`
      this.newRepos[team].name = name;
    }
  }

  writing() {
    // clone original repo
    this.log(`================\nClone the repo ${this.data.url}.\n`);
    this.spawnCommandSync('git', ['clone', this.data.url]);
    process.chdir(this.repoName);
  }

  installing() {
    (async () => {
      for (var team in this.newRepos) {
        const name = this.newRepos[team].name;
        // create new repo
        const repo = await octokit.repos.createInOrg(
          Object.assign({},
            ghConfig.defaultRepoOpts,
            {
              name,
              description: `${this.data.product} project for Labs${this.data.cohort}`,
            })
        );
        octokit.repos.replaceAllTopics({
          owner: ghConfig.defaultRepoOpts.org,
          repo: name,
          names: [`labs${this.data.cohort.toLowerCase()}`],
        });
        this.newRepos[team].repo = repo;
        this.log(`================\nCreated the new github repo ${name}.`);
        // _inspect(repo.data);

        // fork to new repos
        const remoteName = `team${team.toUpperCase()}`
        this.log(`================\n"Forking" to new repo for ${name}.\n`);
        const repoUrl = `https://github.com/${ghConfig.defaultRepoOpts.org}/${name}.git`;
        this.spawnCommandSync('git', ['remote', 'add', remoteName, repoUrl]);
        this.spawnCommandSync('git', ['push', remoteName, 'main']);

        octokit.request("PUT /repos/{owner}/{repo}/branches/{branch}/protection", {
          mediaType: {
            previews: ["symmetra", "loki", "luke-cage"],
          },
          owner: ghConfig.defaultRepoOpts.org,
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
      this.log(`================\nRemove cloned repo ${this.repoName}.\n`);
    })();
  }

  end() {
    // clean up

  }
}