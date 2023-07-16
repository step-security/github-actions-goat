# Compromise of the GITHUB_TOKEN

At the start of each workflow run, GitHub automatically creates a unique GITHUB_TOKEN secret to use in your workflow. You can use the GITHUB_TOKEN to authenticate in a workflow run.

From the [GitHub Actions Hardening Guide](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions#stealing-the-jobs-github_token):

> It is possible for an attacker to steal a job's GITHUB_TOKEN. Once expired, the token is no longer useful to an attacker. To work around this limitation, they can automate the attack and perform it in fractions of a second by calling an attacker-controlled server with the token.

> The attacker server can use the GitHub API to modify repository content, including releases, if the assigned permissions of GITHUB_TOKEN are not restricted.

## Summary of past incidents

Here is an examples of a past incidents where the GITHUB_TOKEN was compromised and used to

### VS Code GitHub Actions Exploit

In December 2020, [ryotkak](https://twitter.com/ryotkak) reported as part of the Bug Bounty program how he exfiltrated the `GITHUB_TOKEN` from a GitHub Actions workflow.

This is the pull request that was merged into a release branch using the compromised GITHUB_TOKEN
https://github.com/microsoft/vscode/pull/113596

You can read the details [here](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/?&web_view=true) and [here](https://blog.ryotak.me/post/vscode-write-access/).
