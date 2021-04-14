# Tools used in X

The X Tools provide various functions used through out the org.

## Setup

1. `git clone https://github.com/Lambda-School-Labs/generator-x-tools.git`
2. `cp .env.sample .env`
3. set the GITHUBKEY enviornment variable with your github personal key.
4. set the HEROKU_API_TOKEN env variable with your personal key
5. `npm i`
6. `npm install -g @lambdalabs/labs`
7. `cd generator-x-tools`
8. `labs ./generators/github/fork-repo`

Each folder in the `github`, `codeclimate` and `heroku` folders is a tool.

## Fork-repo

"Forks" a repo within the same org with a new name.

**Example Usage**

``` bash
Usage:
  labs ./generators/github/fork-repo [options]

Options:
  -h,   --help           # Print the generator's options and usage
        --skip-cache     # Do not remember prompt answers               Default: false
        --skip-install   # Do not automatically install dependencies    Default: false
        --force-install  # Fail on install dependencies error           Default: false
        --ask-answered   # Show prompts for already configured options  Default: false
  -u,   --url            # URL of git repo to clone (HTTPS git url)
  -p,   --product        # name of the product
  -t,   --teams          # team count
  -l,   --cohort         # labs cohort number (FT32, PT18)
  -r,   --purpose        # repo purpose
```

### Prompts

- What is the URL of github repo to clone (HTTPS git url)?
- What is the name of the product or abbreviated name?
- How many teams for the product?
- What is the Labs cohort? (FT32, PT18)
- What will the repo be used for? [Frontend,Backend,Datascience,iOS]

## codeclimate/create-project

Adds a repo to the Labs [Code Climate](https://codeclimate.com) Org.

**Example Usage**

``` bash
Usage:
  labs ./generators/codeclimate/create-project [options]
```

### Prompts

- What is the name of the repo? (just the slug in the URL)


## Delete-repo

Deletes a repo from the github Labs org.

**Example Usage**

``` bash
Usage:
  labs ./generators/github/remove-repo [options]

Options:
  -h,   --help           # Print the generator's options and usage
        --skip-cache     # Do not remember prompt answers               Default: false
        --skip-install   # Do not automatically install dependencies    Default: false
        --force-install  # Fail on install dependencies error           Default: false
        --ask-answered   # Show prompts for already configured options  Default: false
  -p,   --repo           # name of the repo
```

### Prompts

- What is the name of the repo?

## make-teams

Create N teams for a product

**Example Usage**

``` bash
Usage:
  labs ./generators/github/make-teams [options]

Options:
  -h,   --help           # Print the generator's options and usage
        --skip-cache     # Do not remember prompt answers               Default: false
        --skip-install   # Do not automatically install dependencies    Default: false
        --force-install  # Fail on install dependencies error           Default: false
        --ask-answered   # Show prompts for already configured options  Default: false
  -p,   --product        # name of the product
  -t,   --teams          # team count
  -l,   --cohort         # labs cohort number (FT32, PT18)
```

### Prompts

- What is the name of the product or abbreviated name?
- How many teams for the product?
- What is the Labs cohort? (FT32, PT18)

## remove-teams

Delete teams from labs org

**Example Usage**

``` bash
Usage:
  labs ./generators/github/remove-teams [options]

Options:
  -h,   --help           # Print the generator's options and usage
        --skip-cache     # Do not remember prompt answers                                      Default: false
        --skip-install   # Do not automatically install dependencies                           Default: false
        --force-install  # Fail on install dependencies error                                  Default: false
        --ask-answered   # Show prompts for already configured options                         Default: false
  -t,   --teamSlugs      # comma list of team slugs? (pt17-cityspire-c,pt17-merchantmarket-a)
```

### Prompts

- What are the team slugs? (pt17-cityspire-c,pt17-merchantmarket-a)

remove-teams [options]

## update-teams

Update team with members, maintainers, and repos

**Example Usage**

``` bash
Usage:
  labs ./generators/github/update-teams [options]

Options:
  -h,   --help           # Print the generator's options and usage
        --skip-cache     # Do not remember prompt answers                              Default: false
        --skip-install   # Do not automatically install dependencies                   Default: false
        --force-install  # Fail on install dependencies error                          Default: false
        --ask-answered   # Show prompts for already configured options                 Default: false
  -t,   --slug           # team slug (pt17-city-spire-a)
  -b,   --members        # comma list of members github handles (handle1,handle2)
  -m,   --maintainers    # comma list of maintainers github handles (handle1,handle2)
  -r,   --repos          # comma list of repo names? (repo1,repo2)
```

### Prompts

- What is the team slug? (pt17-city-spire-a)
- Comma list of members github handles? (handle1,handle2)
- Comma list of maintainers github handles? (handle1,handle2)
- Comma list of repo names? (repo1,repo2)
