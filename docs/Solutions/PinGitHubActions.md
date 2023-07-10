# Pin GitHub Actions in your Workflows

GitHub Action tags and Docker tags are mutatble. This poses a security risk. GitHub's Security Hardening guide recommends pinning actions to full length commit.

## Tutorial

1. You can pin GitHub Actions to a commit SHA for each Action in the workflow file. Doing so manually is cumbersome, as you need to look for the commit SHA for a tag for each GitHub Action.

2. To pin Actions automatically navigate to https://app.stepsecurity.io/securerepo. Enter your repository in the textbox and click on `Analyze Repository`. You will see several recommendations for improving GitHub Actions Security for your repository.

3. Keep the `Pin Actions to a full length commit SHA` checked and un-check the rest of the recommendations for now. We will check them in future tutorials.

4. Click on `Create Pull Request` button. You will see a pull request with the Actions pinned in each of the workflow files.

5. Merge the pull request to apply the fix.
