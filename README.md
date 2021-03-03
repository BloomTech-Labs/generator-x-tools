# Tools used in X

The X Tools provide various functions used through out the org.

## Fork-repo

"Forks" a repo within the same org with a new name.

**Example Usage**

``` bash
labs ./generators/fork-repo
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
labs ./generators/remove-repo
```

### Prompts

- What is the name of the repo?
