<p align="left">
  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/Logo.png" alt="Step Security Logo" width="340">
</p>

# Supply Chain Goat

[![Slack](https://img.shields.io/badge/Join%20the%20Community-Slack-blue)](https://join.slack.com/t/stepsecuritygroup/shared_invite/zt-11q5o2icy-9xuW51dJWQffFVl3DX98BQ)

## Introduction

Supply Chain Goat follows the tradition of existing *Goat projects (e.g. OWASP Web Goat). It provides a training ground to practice implementing countermeasures specific to the software supply chain. 

A software supply chain is anything that affects, modifies or goes into your code from development to production deployment through a CI/CD pipeline. A software supply chain includes: who wrote it, when it was contributed, how it’s been reviewed for security issues, known vulnerabilities, supported versions, license information, etc. A software supply chain also encompasses other parts of the stack beyond a single application, including the build and packaging scripts or the software running the infrastructure the application runs on. A software supply chain also includes any information you want to know about the software you’re running to help you determine any risks in running it.

StepSecurity defines a supply chain attack as an attack that tries to hijack software that you produce or consume. [OSSF Scorecards](https://github.com/ossf/scorecard) recommends using the StepSecurity tool to secure workflows and fix GitHub token permissions.

To learn more about software supply chain security, refer this [GitHub blog post](https://github.blog/2020-09-02-secure-your-software-supply-chain-and-protect-against-supply-chain-threats-github-blog/). 

Follow these tutorials to learn about threats and countermeasures related to the software supply chain. If you would like to see a different threat being addressed, or have other feedback, please create an issue.

## Prerequisites

StepSecurity recommends the following prerequisites to be met to get the best out of these tutorials.
* GitHub account
* Basic knowledge of CI/CD pipelines and GitHub Actions

## Threats and Countermeasures

This table lists threats and countermeasures related to software supply chain security. More will be added over time. 

Number | Threats  | Countermeasures  | Related incidents
-------|--------- |------------------|----------------
1      |DNS exfiltration for reconnaissance from build server | Tutorial: [Prevent DNS Exfiltration from build server](https://github.com/step-security/supply-chain-goat/blob/main/DNSExfiltration.md) | [Dependency confusion](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610)
2      |Exfiltration of secrets from the build server | Tutorial: [Restrict outbound traffic from build server](https://github.com/step-security/supply-chain-goat/blob/main/RestrictOutboundTraffic.md) | [Codecov breach](https://about.codecov.io/security-update/), [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [VS Code GitHub Bug Bounty Exploit](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/)
3      |Exfiltration of `GITHUB_TOKEN` from the build server | Tutorial: [Set minimum permissions for `GITHUB_TOKEN`](https://github.com/step-security/supply-chain-goat/blob/main/MinimumTokenPermissions.md)| [VS Code GitHub Bug Bounty Exploit](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/)
4      |Masquerading of tools on build server | Tutorial: Cryptographically verify tools run as part of the CI/ CD pipeline (coming soon)  | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technical-analysis/), [Codecov breach](https://about.codecov.io/security-update/)
5      |Modification of source code on build server | Tutorial: [Monitor source code on build server](https://github.com/step-security/supply-chain-goat/blob/main/MonitorSourceCode.md)  | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technical-analysis/)
6      |No forensics data about build & release steps | Tutorial: Generate provenance (coming soon)  | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technical-analysis/), [Codecov breach](https://about.codecov.io/security-update/), [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html)
7      |Compromised dependency | Tutorial: Use trustworthy dependencies (coming soon)  | [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [Embedded malware in ua-parser-js](https://github.com/advisories/GHSA-pjwm-rvh2-c87w)
8      |Typosquatting | Tutorial: Use trustworthy dependencies (coming soon)  | [Malicious python libraries](https://www.zdnet.com/article/two-malicious-python-libraries-removed-from-pypi/), [Typosquatted libraries in Ruby Gems repo](https://thehackernews.com/2020/04/rubygem-typosquatting-malware.html)
9      |Compromised dependency | Tutorial: Quickly find libraries that are using compromised dependency (coming soon)  | [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [Embedded malware in ua-parser-js](https://github.com/advisories/GHSA-pjwm-rvh2-c87w)
