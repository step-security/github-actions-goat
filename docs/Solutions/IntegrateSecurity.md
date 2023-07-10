# Integrate security scanning as part of the CI/CD pipeline

In this tutorial you will add an SAST (Static application security testing) tool, a dependency review tool, and the OpenSSF Scorecard workflow to your repository.

## Tutorial

1. Navigate to https://app.stepsecurity.io/securerepo. Enter your repository in the textbox and click on `Analyze Repository`. You will see several recommendations for improving GitHub Actions Security for your repository.

2. Keep the `Add CodeQL Workflow`, `Add Dependency Review Workflow`, and `Add OpenSSF Scorecard Workflow` checked and un-check the rest of the recommendations for now. We will check them in future tutorials.

3. Click on `Create Pull Request` button. You will see a pull request with three GitHub Actions workflows.

4. Merge the pull request.

5. Next, you should see some issues in the `Security` tab of your repository. These issues have been created by these security tools. In the future, these tools will run periodically and find security issues in pull requests.

> https://app.stepsecurity.io/securerepo has been used by over 500 public repositories to apply GitHub Actions Security best practices. You can browse pull requests for the Top 50 repositories at https://app.stepsecurity.io/securerepo/trending
