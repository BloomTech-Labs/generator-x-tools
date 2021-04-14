const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env');
const result = require('dotenv').config({ path: envPath })
if (result.error) {
  throw result.error
}

const pkg = require('../package.json');
const klr = require('kleur');
const BaseGenerator = require('@lambdalabs/base-generator');

module.exports = class extends BaseGenerator {
  ghOrg = "Lambda-School-Labs";
  constructor(args, opts) {
    super(args, opts);
    this._fs = fs;
    this.klr = klr;
    this.pkg = pkg;
  }

  _exit(code, msg) {
    console.error(`Error: ${msg}`);
    process.exit(code);
  }

  _makeConfig(config, custom={}) {
    return Object.assign({}, config, custom)
  }

  _makeTeamName(cohort, product, letter) {
    return `${cohort} - ${product} - ${letter}`;
  }

  _makeTeamSlug(cohort, product, letter) {
    return `${cohort}-${product}-${letter}`;
  }

  _inspect(obj, level = 0) {
    var spaces = "";
    for (var i = 0; i < level; i++) { spaces += " "; }
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          this.log(spaces + this.klr.bold(prop) + ':');
          this._inspect(obj[prop], level + 2);
        } else {
          this.log(`${spaces}${this.klr.bold(prop)}: ${obj[prop]}`)
        }
      }
    }
  }

  _makeAppObjects(cohort, product, appCount, purpose='') {
    const apps = {};
    const purposeStr = `-${purpose}`;
    for (var i = 0; i < appCount; i++) {
      const letter = String.fromCharCode(97 + i)
      const app = { name: this._makeTeamSlug(cohort, product, letter) };
      if(purpose != '') { app.name = app.name.concat(purposeStr); }
      apps[letter] = app;
    }
    return apps;
  }

  _makeTeamSlugsPromptOpt() {
    this._makePromptOption(
      'teamSlugs',
      {
        type: 'input',
        message: 'What are the team slugs? (pt17-cityspire-c,pt17-merchantmarket-a)',
        store: true,
      },
      {
        type: String,
        alias: 't',
        desc: 'comma list of team slugs? (pt17-cityspire-c,pt17-merchantmarket-a)',
      }
    );
  }

  _makeRepoUrlPromptOpt() {
    this._makePromptOption(
      'repoUrl',
      {
        type: 'input',
        message: 'What is the URL of github repo URL (HTTPS git url)?',
        store: true,
      },
      {
        type: String,
        alias: 'u',
        desc: 'URL of git repo URL (HTTPS git url)',
      }
    );
  }

  _makeRepoPromptOpt() {
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

  _makeTeamLetterPromptOpt() {
    this._makePromptOption(
      'teamLetter',
      {
        type: 'input',
        message: 'What is the letter of the team?',
        store: true,
      },
      {
        type: String,
        alias: 't',
        desc: 'team letter',
      }
    );
  }
  
  _makeTeamSlugPromptOpt() {
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
  }
  _makeMembersPromptOpt() {
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
  }
  
  _makeMaintainersPromptOpt() {
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
  }
  _makeProductPromptOpt() {
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
  }
  _makeTeamCountPromptOpt() {
    this._makePromptOption(
      'teamCount',
      {
        type: 'number',
        message: 'How many teams for the product?',
        store: true,
      },
      {
        type: Number,
        alias: 't',
        desc: 'team count',
      }
    );
  }
  _makeCohortPromptOpt() {
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
  }
};
