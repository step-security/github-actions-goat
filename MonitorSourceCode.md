<p align="left">
  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/Logo.png" alt="Step Security Logo" width="340">
</p>

# Tutorial: Monitor source code on build server
_Estimated completion time: 3 minutes_

## Summary of past incidents

### SUNSPOT: An Implant in the Build Process
In December 2020, the industry was rocked by the disclosure of a [supply chain attack](https://www.crowdstrike.com/blog/sunspot-malware-technical-analysis/) against SolarWinds, Inc. The supply chain attack was the result of inclusion of unauthorized malicious code during the build process. SUNSPOT is the name of the malware used to insert a backdoor into software builds of the SolarWinds Orion IT management product.

Quoting from the article:
> When SUNSPOT finds the Orion solution file path in a running MsBuild.exe process, it replaces a source code file in the solution directory, with a malicious variant to inject SUNBURST while Orion is being built. 

> The original source file is copied with a .bk extension (e.g., InventoryManager.bk), to back up the original content. The backdoored source is written to the same filename, but with a .tmp extension (e.g., InventoryManager.tmp), before being moved using MoveFileEx to the original filename (InventoryManager.cs)

> SUNSPOT waits for the MsBuild.exe process to exit before restoring the original source code and deleting the temporary InventoryManager.bk file

The attack method is such that without active monitoring on the build server, it would not be possible to detect that the source code file is being modified during the build. If one looks at the source file before and after the build, it would be as expected. 

## How does StepSecurity mitigate this threat?
StepSecurity [`harden-runner`](https://github.com/step-security/harden-runner) monitors the file system during the workflow and detects each file write event. If a source code file is overwritten, it detects that, and notifies the developer about it.

## Tutorial
Learn how to detect source code modification on the build server in a GitHub Actions workflow. 

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button. 
   
   <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/EnableActions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the `ci.yml` file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step. After the checkout step, add another step to simulate modification of a source code file. The updated file should look like this:

```
name: Test and coverage

on: [push, pull_request, workflow_dispatch]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: step-security/harden-runner@v1
        with:
          egress-policy: audit
      - uses: actions/checkout@v2
        with:
          fetch-depth: 2
      - run: |  # simulate modification of source code
          code='package calc\n\nfunc Add(x, y int) int {\nprintln("code added")\nreturn x + y\n}'
          printf "$code" > calc1.go
          mv calc1.go calc.go
      - uses: actions/setup-go@v2
        with:
          go-version: '1.17'
      - name: Run coverage
        run: go test -race -coverprofile=coverage.txt -covermode=atomic
      - name: Upload coverage to Codecov
        run: |
          bash <(curl -s https://codecov.io/bash)    
```

Commit the changes either to `main` branch or any other branch.  

4. The `step-security/harden-runner` GitHub Action installs an agent into the Ubuntu VM that monitors changes to source code. In a typical workflow, source code is checked out from the repository and does not need to be altered. In this case, since it is altered, the change will be detected. 

5. Observe the workflow run.  `step-security/harden-runner` detects that a source code file is modified and adds an annotation to the workflow. 

    <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/SourceChangeDetected1.png" alt="Source code change detected" width="800">
