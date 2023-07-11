# GitHub Actions Runtime Security - Filter Network Traffic

For examples of real-world incidents in which credentials have been exfiltrated from CI/CD pipelines, refer to [Exfiltration of secrets from the CI/ CD pipeline](../Vulnerabilities/ExfiltratingCICDSecrets.md)

## Tutorials

1. [Filter Network Traffic (GitHub-hosted Runner)](#tutorial-github-hosted-runner)
2. [Filter Network Traffic (Actions Runner Controller)](#tutorial-actions-runner-controller)

## Filter Network Traffic (GitHub-hosted Runner)

In this tutorial, you will use the `step-security/harden-runner` GitHub Action to audit and filter network traffic to prevent credential exfiltration.

1. Browse to the [ci.yml](../../.github/workflows/ci.yml) file. Add the `step-security/harden-runner` GitHub Action as the first step. Commit the changes to `main` branch.

   ```yaml
   - uses: step-security/harden-runner@v2
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
         - uses: step-security/harden-runner@v2
           with:
             egress-policy: audit
         - uses: actions/checkout@v2
           with:
             fetch-depth: 2
         - uses: actions/setup-go@v2
           with:
             go-version: "1.17"
         - name: Run coverage
           run: go test -race -coverprofile=coverage.txt -covermode=atomic
         - name: Upload coverage to Codecov
           run: |
             bash <(curl -s https://codecov.io/bash)
   ```

2. This change should cause the workflow to run, as it is set to run on push. Click on the `Actions` tab to view the workflow run.

3. You should see a link to security insights and recommendations for the workflow run.

<img src="../../images/InsightsLink.png" alt="Link to security insights" width="800">

4. Click on the link. You should see outbound traffic correlated with each step of the workflow. An outbound network policy would be recommended.

5. Update the [ci.yml](../../.github/workflows/ci.yml) workflow with the policy. The first step should now look like this. From now on, outbound traffic will be restricted to only these domains for this workflow.

   ```yaml
   - uses: step-security/harden-runner@v2
     with:
       egress-policy: block
       allowed-endpoints: >
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
         - uses: step-security/harden-runner@v2
           with:
             egress-policy: block
             allowed-endpoints: >
               codecov.io:443
               github.com:443
         - uses: actions/checkout@v2
           with:
             fetch-depth: 2
         - uses: actions/setup-go@v2
           with:
             go-version: "1.17"
         - name: Run coverage
           run: go test -race -coverprofile=coverage.txt -covermode=atomic
         - name: Upload coverage to Codecov
           run: |
             bash <(curl -s https://codecov.io/bash)
   ```

6. Simulate an exfiltration attack similar to Codecov. Update the workflow and add the following statement. The bash uploader is no longer vulnerable, but when it was, it would have made an additional outbound call, which is being simulated here.

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
         - uses: step-security/harden-runner@v2
           with:
             egress-policy: block
             allowed-endpoints: >
               codecov.io:443
               github.com:443
         - uses: actions/checkout@v2
           with:
             fetch-depth: 2
         - uses: actions/setup-go@v2
           with:
             go-version: "1.17"
         - name: Run coverage
           run: go test -race -coverprofile=coverage.txt -covermode=atomic
         - name: Upload coverage to Codecov
           run: |
             bash <(curl -s https://codecov.io/bash)
             curl -X GET http://104.248.94.23
   ```

7. This change should cause the workflow to run, as it is set to run on push. Observe that the workflow fails because the call is blocked. Click the link to security insights. You can see that blocked calls are shown in Red color in the insights page.

   <img src="../../images/RestrictOutboundTraffic.png" alt="Blocked calls are shown in Red" width="800">

8. Install the [StepSecurity Actions Security GitHub App](https://github.com/apps/stepsecurity-actions-security) to get notified via email or Slack when outbound traffic is blocked.

## Filter Network Traffic (Actions Runner Controller)

Actions Runner Controller (ARC) is a Kubernetes operator that orchestrates and scales self-hosted runners for GitHub Actions.

1. Rather than incorporating the HardenRunner GitHub Action into each individual workflow, you'll need to install the ARC-Harden-Runner daemonset on your Kubernetes cluster.

2. Upon deployment, the ARC-Harden-Runner daemonset constantly monitors the outbound calls and correlates them with each step of the workflow.

3. Install the [StepSecurity Actions Security GitHub App](https://github.com/apps/stepsecurity-actions-security)

4. With the app installed, you can access security insights and runtime detections under the `Runtime Security` tab in your dashboard

For a demo of a workflow running on ARC with Harden Runner integrated, please refer to following links:

- Workflow file: https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/arc-self-hosted.yml
- Example workflow run: https://github.com/step-security/github-actions-goat/actions/runs/5523945688
- Workflow Insights: https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/5523945688

As demonstrated, auditing of outbound traffic occurs automatically, without the need to add the Harden Runner Action to each workflow.

Even though you do not need to add Harden-Runner Action, the insights are exactly the same as with GitHub-hosted runner.

> It's important to note that while the feature to restrict outbound traffic is not yet available for ARC, it is currently in development and is expected to be released in a few weeks.
