# Tools used in X

The X Tools provide various functions used through out the org.

## Setup

1. `cp .env.sample .env`
2. set the GITHUBKEY enviornment variable with your github personal key.
3. `npm install @lambdalabs/labs`
4. `git clone https://github.com/Lambda-School-Labs/generator-x-tools.git`
5. `cd generator-x-tools`
6. `labs ./generators/fork-repo`

## Fork-repo

"Forks" a repo within the same org with a new name.

**Example Usage**

``` bash
Usage:
  labs ./generators/fork-repo [options]

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

## Delete-repo

Deletes a repo from the github Labs org.

**Example Usage**

``` bash
Usage:
  labs ./generators/remove-repo [options]

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
  labs ./generators/make-teams [options]

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