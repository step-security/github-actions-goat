# Tampering of source code or artifacts during build

GitHub Actions workflows can be poisoned, potentially leading to the tampering of source code or artifacts during build. This can occur in various ways, such as:

1. **Direct Workflow Alteration:** An attacker can directly modify the workflow, introducing code that tampers source code or artifacts on disk during build.
2. **Utilizing Malicious or Vulnerable Dependencies:** An attacker might exploit a GitHub Action or any other dependency incorporated in the workflow that has been tampered with or is inherently vulnerable.
3. **Code Execution During Workflow Run:** A scenario can occur where code with harmful intent gets executed during a workflow run. This could be instigated through a seemingly innocuous component such as a test case.
4. **Build Server Compromise:** An attacker might attempt to breach the security of the build server on which the GitHub Actions workflow runs.

## Summary of past incidents

Here are some examples of past incidents where CI/CD pipelines were poisoned to tamper with source code or artifacts on disk during the build process.

### SUNSPOT: An Implant in the Build Process

In December 2020, the industry was rocked by the disclosure of a [supply chain attack](https://www.crowdstrike.com/blog/sunspot-malware-technical-analysis/) against SolarWinds, Inc. The supply chain attack was the result of inclusion of unauthorized malicious code during the build process. SUNSPOT is the name of the malware used to insert a backdoor into software builds of the SolarWinds Orion IT management product.

Quoting from the article:

> When SUNSPOT finds the Orion solution file path in a running MsBuild.exe process, it replaces a source code file in the solution directory, with a malicious variant to inject SUNBURST while Orion is being built.

> The original source file is copied with a .bk extension (e.g., InventoryManager.bk), to back up the original content. The backdoored source is written to the same filename, but with a .tmp extension (e.g., InventoryManager.tmp), before being moved using MoveFileEx to the original filename (InventoryManager.cs)

> SUNSPOT waits for the MsBuild.exe process to exit before restoring the original source code and deleting the temporary InventoryManager.bk file

The attack method is such that without active monitoring on the build server, it would not be possible to detect that the source code file is being modified during the build. If one looks at the source file before and after the build, it would be as expected.

In addition, the malware was running with admin privileges on the build server, which allowed it to using debugging privileges to read another process's memeory.

> The malware then grants itself debugging privileges by modifying its security token to add SeDebugPrivilege. This step is a prerequisite for the remainder of SUNSPOT’s execution, which involves reading other processes’ memory.

### event-stream incident

A malicious package `flatmap-stream` was added as a direct dependency of the `event-stream` package by a new maintainer in September 2018. While the `event-stream` package was widely used, the malicious code targeted a specific software - [BitPay](https://github.com/bitpay/wallet/issues/9346). During the build process, the malicious package injects code into the ReedSolomonDecoder.js file [by modifying the file on disk](https://dl.acm.org/doi/pdf/10.1145/3517208.3523753). In the hijacked versions of BitPay Copay app, the malicious code steals wallet keys and exfiltrates them to the attacker's endpoint.
