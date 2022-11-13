# Attack Simulator

[![Maintained by stepsecurity.io](https://img.shields.io/badge/maintained%20by-stepsecurity.io-blueviolet)](https://stepsecurity.io/?utm_source=github&utm_medium=organic_oss&utm_campaign=harden-runner)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://raw.githubusercontent.com/step-security/harden-runner/main/LICENSE)

Simulate past supply chain attacks such as `SolarWinds`, `Codecov`, and `ua-parser-js` and see how [`Harden-Runner`](https://github.com/step-security/harden-runner) stops them. [Harden-Runner GitHub Action](https://github.com/step-security/harden-runner) installs a security agent on the GitHub-hosted runner (Ubuntu VM) to

- Prevent exfiltration of credentials
- Detect tampering of source code during build
- Enable running jobs without sudo access

## Weekly instructor-led session

While you can follow the hands-on tutorials on your own, you can also attend a free weekly instructor-led session. 
Register [here](https://calendly.com/varunsh-step/supply-chain-goat).

## Attack Simulations

This table lists the different attack methods you can simulate. In each case, you then use [`Harden-Runner`](https://github.com/step-security/harden-runner) to stop the attack.

| Number | Attack Simulation                                                                          | Related incidents                                                                                                                                                                                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | [DNS exfiltration typically used in dependency confusion attacks](docs/DNSExfiltration.md) | [Dependency confusion](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610)                                                                                                                                                                                                                                     |
| 2      | [Exfiltration of secrets from the CI/ CD pipeline](docs/RestrictOutboundTraffic.md)        | [Codecov breach](https://about.codecov.io/security-update/), [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [VS Code GitHub Bug Bounty Exploit](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/) |
| 3      | [Tampering of source code during build](docs/MonitorSourceCode.md)                         | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technical-analysis/)                                                                                                                                                                                                                               |
| 4      | [Use of compromised dependencies](docs/CompromisedDependency.md)                           | [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [Embedded malware in ua-parser-js](https://github.com/advisories/GHSA-pjwm-rvh2-c87w)                                                                                                                         |
