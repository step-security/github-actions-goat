# GitHub Actions Runtime Security - Filter Network Traffic

> For examples of real-world incidents in which credentials have been exfiltrated from CI/CD pipelines, refer to [Exfiltration of secrets from the CI/ CD pipeline](../Vulnerabilities/ExfiltratingCICDSecrets.md)

> **["Implement network segmentation and traffic filtering" in CISA/NSA guide](https://media.defense.gov/2023/Jun/28/2003249466/-1/-1/0/CSI_DEFENDING_CI_CD_ENVIRONMENTS.PDF)**: Implement and ensure robust network segmentation between networks and functions to reduce the spread of malware and limit access from other parts of the network that do not need access.

[🔙 Go back to the list of tutorials](../../README.md#vulnerabilities-and-countermeasures)

## Tutorials

1. [Filter Network Traffic (GitHub-hosted Runner)](#filter-network-traffic-github-hosted-runner)
2. [Filter Network Traffic (Actions Runner Controller)](#filter-network-traffic-actions-runner-controller)
3. [Filter Network Traffic (Self-Hosted VM Runners e.g. on EC2)](#filter-network-traffic-self-hosted-vm-runners-eg-on-ec2)

## Filter Network Traffic (GitHub-hosted Runner)

In this tutorial, you will use the `step-security/harden-runner` GitHub Action to audit and filter network traffic to prevent code and CI/CD credential exfiltration.

### Network Monitoring without Harden-Runner

Without Harden-Runner, you have no visibility into what outbound connections were made during a workflow run.

1. Go to the `Actions` tab and run the `Hosted: Network Monitoring without Harden-Runner` workflow.

2. Check out the build logs. From the build logs you see that a package was installed and a docker image was built and published.

As we will see next, one of these steps is making an unexpected outbound call, but you cannot know that without egress network monitoring.

### Network Monitoring with Harden-Runner

1. Go to the `Actions` tab and run the `Hosted: Network Monitoring with Harden-Runner` workflow.

2. View the workflow [hosted-network-monitoring-hr.yml](../../.github/workflows/hosted-network-monitoring-hr.yml) file.

3. `step-security/harden-runner` GitHub Action is used as the first step in the job. Notice the `egress-policy` is set to `audit`

4. After the workflow completes, check out the build logs. In the `Harden-Runner` step, you will see a link to security insights and recommendations.

5. Click the link and you will see the outbound calls that were made from each of the steps.

You can now see that the `npm install` step is making a call to `attacker.com`, which is not expected.

### Answer to the puzzle

There is a [Puzzle in the README](../../README.md#puzzle-time) about a call to `attacker.com`. To understand why this call is being made:

- Check out the `package.json` file of the [exfiltration-demo](../../src/exfiltration-demo/package.json) folder.
- It has a dependency called `@step-security/malware-simulator`
- This dependency simulates a malicious package. Its [package.json](../../src/malware-simulators/exfiltration-simulator/package.json) has a `pre-install` step that calls [compile.js](../../src/malware-simulators/exfiltration-simulator/compile.js)
- The compile.js file makes an outbound call to `attacker.com`
- As a result, when `npm install` is run in the workflow, the `pre-install` step of the dependency is run, which makes the outbound call.

### Network Filtering with Harden-Runner

Now lets see how to filter traffic to expected destinations and block everything else.

1. Go to the `Actions` tab and run the `Hosted: Network Filtering with Harden-Runner` workflow.

2. View the workflow [hosted-network-filtering-hr.yml](../../.github/workflows/hosted-network-filtering-hr.yml) file.

3. `step-security/harden-runner` GitHub Action has `egress-policy` set to `block`. Only the destinations that are expected are in the allowed list. `attacker.com` is not in this list.

4. After the workflow completes, check out the build logs.

5. Click the insights link from the `Harden-Runner` step. You will notice that the call to `attacker.com` was blocked in this case.

6. You can also install the [StepSecurity Actions Security GitHub App](https://github.com/apps/stepsecurity-actions-security) to get notified via email or Slack when outbound traffic is blocked.

## Filter Network Traffic (Actions Runner Controller)

Actions Runner Controller (ARC) is a Kubernetes operator that orchestrates and scales self-hosted runners for GitHub Actions.

- Rather than incorporating the HardenRunner GitHub Action into each individual workflow, you install the ARC-Harden-Runner daemonset on your Kubernetes cluster.

> Please email us at support@stepsecurity.io for instructions on how to install the ARC-Harden-Runner daemonset on your Kubernetes cluster.

- Upon installation, the ARC-Harden-Runner daemonset constantly monitors the outbound calls and correlates them with each step of the workflow.

- You can access security insights and runtime detections under the `Runtime Security` tab in your dashboard

For a demo of a workflow running on ARC with Harden Runner integrated, follow this tutorial:

### Network Monitoring

1. View this workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/arc-zero-effort-observability.yml

   Notice that `harden-runner` Action is not added to this workflow, and that this workflow runs on a `self-hosted` runner.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/6292615173

3. Visit the workflow insights for this run here:
   https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/6292615173
   You can see the outbound traffic for each of the steps, without the need to add `harden-runner` to each job.

Even though you do not need to add Harden-Runner Action, the insights are exactly the same as with GitHub-Hosted runner.

### Secure-by-default ARC Cluster Level Network Policy

You can apply a secure-by-default ARC Cluster Level Network Policy that restricts outbound traffic for any job that is run on the ARC managed runners. This ensures that all workflows have a baseline restrictive policy applied.

To see this in action, follow these steps:

1. View this workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/arc-secure-by-default.yml

   Notice that `harden-runner` Action is not added to this workflow. This workflow has two jobs. One runs on a `self-hosted` runner secured by ARC Harden-Runner and the other on a GitHub-Hosted runner. Both jobs make an outbound call to a direct IP address.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/6285441911

   The call to the direct IP address succeeds for the GitHub-Hosted runner, but is blocked for the self-hosted runner.
   This is because ARC Harden-Runner does not allow calls to direct IP addresses in the secure-by-default policy.
   Typically workflows do not need to make calls to direct IP addresses, but compromised tools or dependencies sometimes make calls to direct IP addresses to avoid detection from DNS monitoring.

3. Visit the workflow insights for this run here:
   https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/6285441911

   You will see that the call to the direct IP address has been blocked.

### Network Filtering with Harden Runner

While there is a secure-by-default policy, to filter traffic to specific destinations in a job run in self-hosted ARC runner, you use the `harden-runner` GitHub Action in `block` mode.

1. View the workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/arc-codecov-simulation.yml

   Notice that `harden-runner` Action is added and there is a list of allowed endpoints.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/6292614301

3. Visit the workflow insights for this run here:
   https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/6292614301

   You will notice that the call to `attacker.com` was blocked in this case.

## Filter Network Traffic (Self-Hosted VM Runners e.g. on EC2)

- Instead of adding the Harden-Runner GitHub Action in each workflow, you'll need to install the Harden-Runner agent on your runner image (e.g. AMI). This is typically done using packer.

> Please email support@stepsecurity.io for instructions on how to install the Harden-Runner agent on your runner image. This agent is different than the one used for GitHub-hosted runners.

- The Harden-Runner agent monitors each job run on the VM; you do NOT need to add the Harden-Runner GitHub Action to each job for audit mode. You do need to add the Harden-Runner GitHub Action for block mode.

- Both ephemeral and persistent VM runners are supported.

- You can access security insights and runtime detections under the Runtime Security tab in your dashboard.

For a demo of a workflow running on self-hosted EC2 with Harden Runner integrated, follow this tutorial:

### Network Monitoring

1. View this workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/self-hosted-network-monitoring-hr.yml

   Notice that `harden-runner` Action is not added to this workflow, and that this workflow runs on a `self-hosted` EC2 runner.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/6386599320

3. Visit the workflow insights for this run here:
   https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/6386599320
   You can see the outbound traffic for each of the steps, without the need to add `harden-runner` to each job.

Even though you do not need to add Harden-Runner Action, the insights are exactly the same as with GitHub-Hosted runner.

### Network Filtering with Harden Runner

To filter traffic to specific destinations in a job run in self-hosted VM runner, you use the `harden-runner` GitHub Action in `block` mode.

1. View the workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/self-hosted-network-filtering-hr.yml

   Notice that `harden-runner` Action is added and there is a list of allowed endpoints.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/6386598192

3. Visit the workflow insights for this run here:
   https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/6386598192

   You will notice that the call to `attacker.com` was blocked in this case.
