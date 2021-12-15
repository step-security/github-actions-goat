<p align="left">
  <img src="https://step-security-images.s3.us-west-2.amazonaws.com/Final-Logo-06.png" alt="Step Security Logo" width="340">
</p>

# Supply Chain Goat

## Introduction

The purpose of this repository is to share information and learn about software supply chain security issues. 

Follow these steps to learn about threats and countermeasures related to the software supply chain. If you would like to see a different threat being addressed, or have other feedback, please create an issue. 

## Threats and Countermeasures

This table lists threats and countermeasures related to software supply chain security. More will be added over time. 

Number | Threats  | Countermeasures  | Related incident
-------|--------- |------------------|----------------
1      |DNS exfiltration for reconnaissance from build server | Tutorial: Restrict outbound traffic from build server (coming soon) | [Dependency confusion](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610)
2      |Exfiltration of secrets from the build server | Tutorial: Restrict outbound traffic from build server | [Codecov breach](https://about.codecov.io/security-update/), [VS Code GitHub Bug Bounty Exploit](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/)
3      |Exfiltration of secrets from the build server | Tutorial: Set minimum permissions for `GITHUB_TOKEN`| [VS Code GitHub Bug Bounty Exploit](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/)
4      |Masquerading of tools on build server | Tutorial: Cryptographically verify tools run as part of the CI/ CD pipeline (coming soon)  | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technica…), [Codecov breach](https://about.codecov.io/security-update/)
5      |Modification of source code on build server | Tutorial: Monitor source code on build server (coming soon)  | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technica…)

