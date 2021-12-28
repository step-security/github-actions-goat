<p align="left">
  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/Logo.png" alt="Step Security Logo" width="340">
</p>

# Tutorial: Detect changes to source code on build server

## Summary of past incidents

### SUNSPOT: An Implant in the Build Process
In December 2020, the industry was rocked by the disclosure of a [supply chain attack](https://www.crowdstrike.com/blog/sunspot-malware-technical-analysis/) against SolarWinds, Inc. The supply chain attack was the result of inclusion of unauthorized malicious code during the build process. SUNSPOT is the name of the malware used to insert a backdoor into software builds of the SolarWinds Orion IT management product.

Quoting from the article:
> SUNSPOT monitors running processes for those involved in compilation of the Orion product and replaces one of the source files to include the SUNBURST backdoor code.

> When SUNSPOT finds the Orion solution file path in a running MsBuild.exe process, it replaces a source code file in the solution directory, with a malicious variant to inject SUNBURST while Orion is being built. 

> The original source file is copied with a .bk extension (e.g., InventoryManager.bk), to back up the original content. The backdoored source is written to the same filename, but with a .tmp extension (e.g., InventoryManager.tmp), before being moved using MoveFileEx to the original filename (InventoryManager.cs)

> SUNSPOT waits for the MsBuild.exe process to exit before restoring the original source code and deleting the temporary InventoryManager.bk file

The attack method is such that without active monitoring on the build server, it would not be possible to detect that the source code file is being modified during the build. If one looks at the source file before and after the build, it would be as expected. 

## Tutorial
Learn how to detect source code modification on the build server in a GitHub Actions worklow. 

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button. 
   
   <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/EnableActions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the `ci.yml` file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step. 
After the checkout step, add another step to modify a source code file. 
The updated file should look like this:

    ```
    steps:
    - uses: step-security/harden-runner@v1
      with:
        egress-policy: audit
    - uses: actions/checkout@v2
      with:
        fetch-depth: 2
    - runs: |  # simulate modification of file
        echo "package calc

        func Add(x, y int) int {
	        return x - y
        }" > calc.go
    ```


Commit the changes either to `main` branch or any other branch.  

4. The `step-security/harden-runner` GitHub Action installs an agent into the Ubuntu VM that monitors changes to source code. In a typical workflow, source code is checked out from the repository and does not need to be altered. 

5. Observe the workflow run.  `step-security/harden-runner` detects that a source code file is modified and adds an annotation to the worklow. 