# Update Workflows to use Least Privileged GITHUB_TOKEN permissions

> For examples of real-world incidents in which `GITHUB_TOKEN` was compromised, refer to [Compromise of the GITHUB_TOKEN](../Vulnerabilities/OverprivilegedGITHUB_TOKEN.md)

## Tutorial

In this tutorial you will update the token permissions for workflows in this repository so they have the minimum permissions needed.

1. You can see the permissions that GITHUB_TOKEN has for a specific job in the "Set up job" section of the workflow run log. Check the permissions for different jobs that you have run so far. You will notice that the permissions are set to `write` for several scopes.

2. You can set the minimum token permissions for each job in the workflow file. Doing so manually is cumbersome, as you need to learn the different permissions and need to know what permissions are used by each step.

3. To set the permissions automatically navigate to https://app.stepsecurity.io/securerepo. Enter your repository in the textbox and click on `Analyze Repository`. You will see several recommendations for improving GitHub Actions Security for your repository.

4. Keep the `Restrict permissions for GITHUB_TOKEN` checked and un-check the rest of the recommendations for now. We will check them in future tutorials.

5. Click on `Create Pull Request` button. You will see a pull request with the token permissions set in each of the workflow files.

6. Merge the pull request. Check the permissions for the jobs in the "Set up job" section of the workflow run log. You will notice that the permissions are set to the minimum needed.

> https://app.stepsecurity.io/securerepo has been used by over 500 public repositories to apply GitHub Actions Security best practices. You can browse pull requests for the Top 50 repositories at https://app.stepsecurity.io/securerepo/trending

## Using Fine-Grained Permissions for GitHub Tokens

To enhance security, it is important to use fine-grained permissions for GitHub tokens. This follows the principle of least privilege, ensuring that each job only has access to what it absolutely needs.

### Example

In the `.github/workflows/hosted-network-filtering-hr.yml` file, you can add `permissions: contents: read` to limit access:

```yaml
name: "Hosted: Network Filtering with Harden-Runner"
on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Harden Runner
        uses: step-security/harden-runner@v2
        with:
          disable-sudo: true
          egress-policy: block
          allowed-endpoints: >
            github.com:443
            www.githubstatus.com:443
      - uses: crazy-max/ghaction-github-status@v4
      - uses: actions/checkout@v3
      - run: |
          curl https://exfiltrationdemo.blob.core.windows.net/
```

By setting the minimum required permissions for the GitHub token in your workflows, you can significantly reduce the risk of accidental or malicious misuse.
