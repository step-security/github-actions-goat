# GitHub Actions Runtime Security - Filter Network Traffic

For examples of real-world incidents in which credentials have been exfiltrated from CI/CD pipelines, refer to [Exfiltrating CI/CD Secrets](#)

## Tutorial

In this tutorial, you will use the step-security/harden-runner GitHub Action to audit and filter network traffic to prevent credential exfiltration.

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button.

   <img src="../images/EnableActions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the [ci.yml](../.github/workflows/ci.yml) file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step. Commit the changes to `main` branch.

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

4. This change should cause the workflow to run, as it is set to run on push. Click on the `Actions` tab to view the workflow run.

5. You should see a link to security insights and recommendations for the workflow run.

<img src="../images/InsightsLink.png" alt="Link to security insights" width="800">

6. Click on the link. You should see outbound traffic correlated with each step of the workflow. An outbound network policy would be recommended.

7. Update the [ci.yml](../.github/workflows/ci.yml) workflow with the policy. The first step should now look like this. From now on, outbound traffic will be restricted to only these domains for this workflow.

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

9. This change should cause the workflow to run, as it is set to run on push. Observe that the workflow fails because the call is blocked. Click the link to security insights. You can see that blocked calls are shown in Red color in the insights page.

   <img src="../images/RestrictOutboundTraffic.png" alt="Blocked calls are shown in Red" width="800">

10. Install the [Harden Runner App](https://github.com/marketplace/harden-runner-app) to get notified via email or Slack when outbound traffic is blocked.

## Using Harden Runner with ARC (Actions Runner Controller) for Auditing Outbound Traffic

Actions Runner Controller (ARC) is a Kubernetes controller for GitHub Actions self-hosted runners.

By deploying the ARC Harden Runner DaemonSet on your Kubernetes cluster, Harden Runner is seamlessly integrated across all your existing GitHub Actions workflows. This facilitates a uniform auditing of outbound traffic without the need to adjust each workflow separately.

During your workflows, the ARC Harden Runner DaemonSet systematically examines the outbound calls made and correlates them with each step of the workflow.

You can see an example of a workflow running on a Kubernetes self-hosted runner with Harden Runner integrated and outbound traffic auditing in place at this [link](#) (to be updated).

Security insights for ARC-based self-hosted runners can be found under the Runtime Security tab in the dashboard at [app.stepsecurity.io](#) (to be updated).

Remember, to utilize Harden Runner with ARC-based self-hosted runners and enforce outbound traffic auditing, it is necessary to install the [Harden Runner App](https://github.com/marketplace/harden-runner-app).

It's important to note that while the feature to restrict outbound traffic is not yet available for ARC-based self-hosted runners, it is currently in development and is expected to be released in a few weeks.
