<p align="left">
  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/Logo.png" alt="Step Security Logo" width="340">
</p>

# Supply Chain Goat

## Introduction

The purpose of this repository is to learn about software supply chain security issues and how to prevent them. 

Follow these tutorials to learn about threats and countermeasures related to the software supply chain. If you would like to see a different threat being addressed, or have other feedback, please create an issue. 

## Threats and Countermeasures

This table lists threats and countermeasures related to software supply chain security. More will be added over time. 

Number | Threats  | Countermeasures  | Related incidents
-------|--------- |------------------|----------------
1      |DNS exfiltration for reconnaissance from build server | Tutorial: [Prevent DNS Exfiltration from build server](https://github.com/step-security/supply-chain-goat/blob/main/DNSExfiltration.md) | [Dependency confusion](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610)
2      |Exfiltration of secrets from the build server | Tutorial: [Restrict outbound traffic from build server](https://github.com/step-security/supply-chain-goat/blob/main/RestrictOutboundTraffic.md) | [Codecov breach](https://about.codecov.io/security-update/), [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [VS Code GitHub Bug Bounty Exploit](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/)
3      |Exfiltration of `GITHUB_TOKEN` from the build server | Tutorial: [Set minimum permissions for `GITHUB_TOKEN`](https://github.com/step-security/supply-chain-goat/blob/main/MinimumTokenPermissions.md)| [VS Code GitHub Bug Bounty Exploit](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/)
4      |Masquerading of tools on build server | Tutorial: Cryptographically verify tools run as part of the CI/ CD pipeline (coming soon)  | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technical-analysis/), [Codecov breach](https://about.codecov.io/security-update/)
5      |Modification of source code on build server | Tutorial: [Monitor source code on build server](https://github.com/step-security/supply-chain-goat/blob/main/MonitorSourceCode.md)  | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technical-analysis/)
6      |Compromised dependency | Tutorial: Use trustworthy dependencies (coming soon)  | [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [Embedded malware in ua-parser-js](https://github.com/advisories/GHSA-pjwm-rvh2-c87w)
7      |Typosquatting | Tutorial: Use trustworthy dependencies (coming soon)  | [Malicious python libraries](https://www.zdnet.com/article/two-malicious-python-libraries-removed-from-pypi/), [Typosquatted libraries in Ruby Gems repo](https://thehackernews.com/2020/04/rubygem-typosquatting-malware.html)
8      |Compromised dependency | Tutorial: Quickly find libraries that are using compromised dependency (coming soon)  | [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [Embedded malware in ua-parser-js](https://github.com/advisories/GHSA-pjwm-rvh2-c87w)
