# Tools used in X

The X Tools provide various functions used through out the org.

## Install

1. `npm install @lambdalabs/labs`
2. `git clone https://github.com/Lambda-School-Labs/generator-x-tools.git`
3. `cd generator-x-tools`
4. `labs ./generators/fork-repo`

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
