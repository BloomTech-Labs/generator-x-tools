const LabsGenerator = require("../labs-generator")
const { Octokit } = require("@octokit/rest");

module.exports = class extends LabsGenerator {
  org = this.ghOrg;
  conf = {
    org: this.org,
    defaultRepoOpts: {
      org: this.org,
      private: false,
      visibility: "public",
      has_issues: true,
      has_projects: false,
      auto_init: false,
      allow_squash_merge: true,
      allow_merge_commit: true,
      allow_rebase_merge: true,
      delete_branch_on_merge: true,
    }
  };
  
  constructor(args, opts) {
    super(args, opts);

    const ghOpts = { 
      auth: process.env.GITHUBKEY,
      userAgent: `LambdaLabs-Tools v${this.pkg.version}`,
    };

    if (process.env.GHDEBUG == 'true') { ghOpts.log = console; }
    this.octokit = new Octokit(ghOpts);
  }

  _makeRepoName(cohort, product, letter, purpose) {
    return `${cohort.toUpperCase()}_${product}-${letter}-${purpose}`;
  }

  _makeReposPromptOpt() {
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

  _makeRepoTypesPromptOpts() {
    this._makePromptOption(
      'repoTypes',
      {
        type: 'checkbox',
        message: 'What type of repos?',
        choices: [
          {
            name: 'Frontend',
            value: 'fe',
            checked: true,
          },
          {
            name: 'Backend',
            value: 'be',
            checked: true,
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
        desc: 'comma list of repo types',
      }
    );
  }
}
