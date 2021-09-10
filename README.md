<p align="left">
  <img src="https://step-security-images.s3.us-west-2.amazonaws.com/Final-Logo-06.png" alt="Step Security Logo" width="340">
</p>

# Supply Chain Goat

## Introduction

The purpose of this repository is to share information and learn about software supply chain security issues. 

Follow these steps to learn about threats and countermeasures related to the software supply chain. If you would like to see a different threat being addressed, or have other feedback, please create an issue. 

## Tutorial #1 - Set minimum permissions for the `GITHUB_TOKEN`

1. Create a fork of the repo.
2. Go to the Actions tab in the fork. Click the "I understand my workflows, go ahead and enable them" button. 
   
   <img src="https://step-security-images.s3.us-west-2.amazonaws.com/perms-enable-actions.png" alt="Enable Actions" width="600">

3. Click on the "Lint" workflow and then click "Run workflow". Once you do this, a GitHub workflow will get triggered.

   <img src="https://step-security-images.s3.us-west-2.amazonaws.com/perms-run-workflow.png" alt="Run Workflow" width="600">

4. Click on the Actions tab again, click on the workflow that just started, and in the job run logs, have a look at the permissions assigned to the `GITHUB_TOKEN`. 
   
   <img src="https://step-security-images.s3.us-west-2.amazonaws.com/perms-token.png" alt="Token permissions" width="600">

5. By default, the `GITHUB_TOKEN` has a lot of permissions assigned. As a [security best practice](https://github.blog/changelog/2021-04-20-github-actions-control-permissions-for-github_token/), the `GITHUB_TOKEN` should be assigned the minimum permissions.  
6. Review the workflow file at `./github/workflows/lint.yml`. You can now manually add the `permissions` key, but it is hard to know what the permissions should be. Different 3rd party Actions may use different permissions. In this tutorial, let us fix the permissions automatically. 
7. Visit [Step Security GitHub App](https://github.com/apps/step-security) and click on Install. Install it on your forked repo.
8. You should see a pull request with the minimum permissions assigned for the workflow. Observe the `permissions` key that has been added. 
9. In the Actions tab, a new workflow run should have been triggered due to the pull request. Have a look at the permissions assigned to the `GITHUB_TOKEN`. Now it has the minimum permissions assigned. Even if the token is compromised, the damage potential is reduced. 
10. You can now set minimum permissions for your own workflows using the [Step Security App](https://github.com/apps/step-security).

## Threats and Countermeasures

This table lists threats and countermeasures related to software supply chain security. More will be added soon. 

Number | Threats  | Countermeasures  | Related incident
-------|--------- |------------------|----------------
1      |Exfiltration of secrets from the pipeline | Use credentials that are minimally scoped | [Codecov breach](https://about.codecov.io/security-update/), where credentials were exfiltrated from pipelines
