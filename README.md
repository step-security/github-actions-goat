# Supply Chain Goat

## Introduction

The purpose of this repository is to share information and learn about software supply chain security issues. 

This repo has some GitHub workflows. Follow these steps to see how the [Step Security GitHub App](https://github.com/apps/step-security) addresses those issues. 

1. Create a fork of the repo.
2. Go to the Actions tab in the fork. Click the "Enable Actions" button. 

## Tutorial #1

1. Create a new issue in the forked repo. Then label the issue as a feature. Once you do this, an action will get triggered. 
2. Go to the Actions tab, and have a look at the permissions assigned to the `GITHUB_TOKEN`. 
3. By default, the `GITHUB_TOKEN` has a lot of permissions assigned. 
4. You can now manually fix the workflow by adding the `permissions` key, but its hard to know what the permissions should be. In this tutorial, lets fix the permissions automatically. 
5. Visit [Step Security GitHub App](https://github.com/apps/step-security) and click on Install. Install it on your forked repo.
6. You should see a pull request with the minimum permissions assigned for the workflow. 
7. Create another issue and label it as a feature. 
8. Go to the Actions tab, and have a look at the permissions assigned to the `GITHUB_TOKEN`. 
9. Now it has only few permissions assigned. 
10. Congratulations on completing the first tutorial!

## Threats and Countermeasures

This table lists threats and countermeasures related to software supply chain security. It will be updated as more features are released. 

Number | Threats  | Countermeasures  | Related incident
-------|--------- |------------------|----------------
1      |Exfiltration of secrets from the pipeline | Use credentials that are minimally scoped | Codecov breach, where credentials were exfiltrated from pipelines
