# Attack Simulator

Simulate attack methods used in past supply chain attacks such as SolarWinds, Codecov, and ua-parser-js, and see how StepSecurity stops them.

## Weekly instructor-led session

While you can follow the hands-on tutorials on your own, if you want, you can also attend the free weekly instructor-led session. Each session is limited to 10 attendees. You can register [here](https://calendly.com/varunsh-step/supply-chain-goat).

## Prerequisites

The following prerequisites should be met to get the best out of these tutorials.

- GitHub account
- Basic knowledge of CI/CD pipelines and GitHub Actions

## Attack Simulations

This table lists the different attack methods you can simulate. In each case, you then use StepSecurity Harden Runner to stop the attack.

| Number | Attack Simulation                                                               | Related incidents                                                                                                                                                                                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | [DNS exfiltration for reconnaissance from build server](DNSExfiltration.md)     | [Dependency confusion](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610)                                                                                                                                                                                                                                     |
| 2      | [Exfiltration of secrets from the build server](<(RestrictOutboundTraffic.md)>) | [Codecov breach](https://about.codecov.io/security-update/), [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [VS Code GitHub Bug Bounty Exploit](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/) |
| 3      | [Modification of source code on build server](MonitorSourceCode.md)            | [Solar Winds (SUNSPOT) breach](http://crowdstrike.com/blog/sunspot-malware-technical-analysis/)                                                                                                                                                                                                                               |
| 4      | [Compromised dependency](CompromisedDependency.md)                              | [event-stream incident](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident.html), [Embedded malware in ua-parser-js](https://github.com/advisories/GHSA-pjwm-rvh2-c87w)                                                                                                                         |
