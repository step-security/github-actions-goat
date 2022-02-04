<p align="left">
  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/Logo.png" alt="Step Security Logo" width="340">
</p>

# Tutorial: Cryptographically verify tools run as part of the CI/ CD pipeline

## Summary of past incidents
### SUNSPOT: An Implant in the Build Process
In December 2020, the industry was rocked by the disclosure of a [supply chain attack](https://www.crowdstrike.com/blog/sunspot-malware-technical-analysis/) against SolarWinds, Inc. The supply chain attack was the result of inclusion of unauthorized malicious code during the build process. SUNSPOT is the name of the malware used to insert a backdoor into software builds of the SolarWinds Orion IT management product.

SUNSPOT was identified on disk with a filename of `taskhostsvc.exe` (SHA256 Hash:c45c9bda8db1d470f1fd0dcc346dc449839eb5ce9a948c70369230af0b3ef168), and internally named `taskhostw.exe` by its developers. In this case SUNSPOT masquerades as a legitimate Windows Binary and replaces a source code file in the solution directory, with a malicious variant

### Codecov breach
In early 2021, secrets were exfiltrated from thousands of build servers, when a popular component used in build pipelines by enterprises, startups, and open source projects - Codecov bash uploader - was modified by adversaries. None of the victims detected that secrets were being exfiltrated to two IP addresses from their build servers for 2 months.

This attack was carried out by gaining unauthorized access to the bash uploaders and modifying them regularly to exfiltrate secrets. Codecov later informed that if the users had conducted a checksum comparison before using the Bash Uploaders as part of their CI processes, this issue may not have impacted them.

## How does StepSecurity mitigate this threat?
StepSecurity verifies the checksums of the tools that are run as a part of the CI/CD pipelines. If the checksum is not verified, StepSecurity informs the user about the failed verification.

## Tutorial
Learn how to prevent masquerade attacks from a GitHub Actions workflow. 

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button. 
   
   <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/EnableActions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the `ci.yml` file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step from `line 9` onwards in the `ci.yml` file. Commit the changes either to `main` branch or any other branch.  

    ```
    - uses: step-security/harden-runner@v1
      with:
        egress-policy: audit
    ```
    The updated file should look like this:
    ```
    name: Test and coverage

    on: [push, pull_request, workflow_dispatch]

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          #Add StepSecurity Harden Runner from here onwards
          - uses: step-security/harden-runner@v1
            with:
              egress-policy: audit
          - uses: actions/checkout@v2
            with:
              fetch-depth: 2
          - uses: actions/setup-go@v2
            with:
              go-version: '1.17'
          - name: Run coverage
            run: go test -race -coverprofile=coverage.txt -covermode=atomic
          - name: Upload coverage to Codecov
            run: |
              bash <(curl -s https://codecov.io/bash)
    ```

4. This change should cause the workflow to run, as it is set to run on push. Click on the `Actions` tab and then click on the `build` tab under the `ci.yml` section to view the workflow run. 

5. You should see a link to security insights and recommendations for the workflow run under the `Run step-security/harden-runner` tab. 

    <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/InsightsLink.png" alt="Link to security insights" width="800">


6. Click on the link. You should see outbound traffic correlated with each step of the workflow. 
    <img src="https://github.com/step-security/supply-chain-goat/blob/main/images/harden-runner/OnlineTool.png" alt="Security insights" width="800">
    
7. Hover above a greened out process name and you would see a popup saying `verified by checksum`. Click on this greened out tile and you should see the verified checksum details. This indicates that the process is not a masqueraded process and the checksum is verified from the source.
    
    <img src="/images/VerifiedChecksum.png" alt="Security insights" width="800">
