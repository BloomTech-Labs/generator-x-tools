const codeclimateGenerator = require("../cc-base");

module.exports = class extends codeclimateGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.initialData = {};

    this._makeRepoPromptOpt();
  }

  initializing() {
    this.log(
      `Welcome to the ${this.klr.red('Labs')} ${this.klr.bold(
        'Repo Code Climate adder-er'
      )}!\n\nThis tool will add a repo to the Labs Code Climate Org. 🎉\n`
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
    // this.log(this.data);
    this.repoSlug = `${this.ghOrg}/${this.data.repo}`
    this.repoUrl = `https://github.com/${this.repoSlug}`;
  }

  writing() {
    (async () => {
      const repoExists = await this.client.get(`/repos?github_slug=${this.repoSlug}`);
      if (repoExists.data.length > 0) {
        this.log("☕️ repo already added to code climate!");
        this._outputLinks(repoExists.data[0]);
      } else {  
        this.log(`adding new repo '${this.repoUrl}'`);
        const res = await this.client.post("/orgs/60751605055d8f00fa000dc9/repos", {
          data: {
            type: "repos",
            attributes: {
              url: this.repoUrl
            }
          }
        });
        this.log("🍰 Repo added to Code Climate!");
        this._outputLinks(res.data);
      }
      
    })();
  }

  _outputLinks(data) {
    this.log(this.klr.bold("Test Reporter ID: ") +data.attributes.test_reporter_id);
    this.log(`maintainability_badge: ${data.links.maintainability_badge}`);
    this.log(`test_coverage_badge: ${data.links.test_coverage_badge}`);
    this.log(`link: ${data.links.self}`);
    this.log(`[![Maintainability](${data.links.maintainability_badge})](${data.links.self}/maintainability)`);
  }
}
