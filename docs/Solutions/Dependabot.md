# Using Dependabot to keep Actions up to date

With Dependabot version updates, when Dependabot identifies an outdated dependency, it raises a pull request to update the manifest to the latest version of the dependency.

## Tutorial

1. To configure the Dependabot configuration file to update Actions navigate to https://app.stepsecurity.io/securerepo. Enter your repository in the textbox and click on `Analyze Repository`. You will see several recommendations for improving GitHub Actions Security for your repository.

2. Keep the `Update Dependabot configuration` checked and un-check the rest of the recommendations for now. We will check them in future tutorials.

3. Click on `Create Pull Request` button. You will see a pull request with a new Dependabot configuration.

4. Merge the pull request to apply the fix.

5. Next, you should see pull requests created by Dependabot to update a few Actions. You will notice that Dependabot also updates the tags mentioned in the comments.

> https://app.stepsecurity.io/securerepo has been used by over 500 public repositories to apply GitHub Actions Security best practices. You can browse pull requests for the Top 50 repositories at https://app.stepsecurity.io/securerepo/trending
