# Welcome to lego-webapp contrubuting guide <!-- omit in toc -->

Thank you for investing your time in contributing to our project! Any contribution you make will be reflected on [abakus.no](https://abakus.no) ✨.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a pull request and getting it merging in.

## New contributor guide

To get an overview of the project, read the [README](README.md). Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Getting started

### Issues

Issues are tracked in the [main lego repository](https://github.com/webkom/lego).

Like any other website, Abakus' is not perfect, and you may stumble on a problem. This could be everything from a nasty bug to a missing feature, and we appreciate to be to enlightened, no matter the size!

Firstly, [search if an issue already exists](https://docs.github.com/en/github/searching-for-information-on-github/searching-on-github/searching-issues-and-pull-requests#search-by-the-title-body-or-comments). If a related issue does not exist, you can open a new one [here](https://github.com/webkom/lego).

### Make changes

1. Fork the repository.

- Using GitHub Desktop:

  - [Getting started with GitHub Desktop](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/getting-started-with-github-desktop) will guide you through setting up Desktop.
  - Once Desktop is set up, you can use it to [fork the repo](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/cloning-and-forking-repositories-from-github-desktop)!

- Using the command line:
  - [Fork the repo](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository) so that you can make your changes without affecting the original project until you're ready to merge them.

2. Set up dev environment

- Install or update to **Node.js v16**. For more information on how, see [this Stack Overflow post](https://stackoverflow.com/questions/7718313/how-to-change-to-an-older-version-of-node-js).

- See [README](https://github.com/webkom/lego-webapp#quick-start) for steps on how to install dependencies and start webserver. Remember to read the [development guide](https://github.com/webkom/lego-webapp#development).

3. Create a working branch and start coding!

### Commit your update

Commit the changes once you are happy with them. Commit messages are to be thoroughly written. Here are our "rules":

1. Write in the imperative mood.
2. Limit the subject line to 50 characters.
3. Capitalize only the first letter in the subject line.
4. Do not put a period at the end of the subject line.
5. Add a body (multi-line message) with an explanation, which means we do not recommend using `-m`.
6. Put a blank line between the subject line and the body.
7. Describe what was done and why, but not how.

Do this ✅

```txt
Fix foo to enable bar

This fixes the broken behavior of the component by doing xyz.
```

Not this ❌

```txt
fixed bug
```

Remember to amend your commits if the changes should have been part of a previous commit. Examples of this are formatting and misspellings. For more information on how to rewrite your Git history, read [this article](https://thoughtbot.com/blog/git-interactive-rebase-squash-amend-rewriting-history).

### Pull request

When you're finished with the changes, create a pull request, also known as a PR. This can be done from the GitHub UI or through the [GitHub CLI](https://cli.github.com/manual/gh_pr_create).

Fill out the pull request template, create and we'll do the rest!

### Your PR is merged!

Congratulations 🎉🎉 Webkom thanks you ✨.

Once your PR is merged, your contributions will be publicly visible on [Abakus' website](https://abakus.no) within 24 hours (most likely).

If your contribution is deemed worthy, you might be qualified for a LEGO-pin! We will try to make contact, but please reach out if we don't manage.
