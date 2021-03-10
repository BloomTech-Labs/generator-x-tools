const { fs, BaseGenerator, pkg, klr, _inspect, _exit, _makeConfig } = require("../base")

exports.fs = fs;
exports.pkg = pkg;
exports.klr = klr;
exports._inspect = _inspect;
exports._exit = _exit;
exports._makeConfig = _makeConfig;

const Github = {};
Github.makeTeamName = (cohort, product, letter) => {
  return `${cohort} - ${product} - ${letter}`;
}
Github.makeTeamSlug = (cohort, product, letter) => {
  return `${cohort}-${product}-${letter}`;
}
Github.makeRepoName = (cohort, product, letter, purpose) => {
  return `${cohort.toUpperCase()}_${product}-${letter}-${purpose}`;
}
Github.org = "Lambda-School-Labs";
Github.config = {
  org: Github.org,
  defaultRepoOpts: {
    org: Github.org,
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

exports.Github = Github;
exports.ghConfig = Github.config;

exports.BaseGenerator = BaseGenerator;

const { Octokit } = require("@octokit/rest");
const opts = {
  auth: process.env.GITHUBKEY,
  userAgent: `LambdaLabs-Tools v${exports.pkg.version}`,
};
if (process.env.GHDEBUG == 'true') { opts.log = console; }
exports.octokit = new Octokit(opts);
