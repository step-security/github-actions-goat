# Supply Chain Goat

## Introduction

The purpose of this repository is to share information and learn about software supply chain security issues. 

This repo has some GitHub workflows. Follow these steps to see how the [Step Security GitHub App](https://github.com/apps/step-security) addresses those issues. 

As of now, the App automatically restricts permissions of the `GITHUB_TOKEN`. This helps counter the threat of the token being exfiltrated. 

1. Create a fork of the repo.
2. Go to the Actions tab in the fork. Click the "Enable Actions" button. 
3. Visit [Step Security GitHub App](https://github.com/apps/step-security) and click on Install. Install it on the fork. 

You should see a pull request with security improvements. As of now, the App automatically restricts permissions of the `GITHUB_TOKEN`. 

## Threats and Countermeasures

This table lists threats and countermeasures related to software supply chain security. It will be updated as more features are released. 

Number | Threats  | Countermeasures  | Related incident
-------|--------- |------------------|----------------
1      |Exfiltration of secrets from the pipeline | Use credentials that are minimally scoped | Codecov breach, where credentials were exfiltrated from pipelines
