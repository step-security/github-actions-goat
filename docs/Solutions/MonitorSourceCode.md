# GitHub Actions Runtime Security - Detect File Tampering

> For examples of real-world incidents in which files have been tampered during the build and release process in CI/CD pipelines, refer to [Tampering of source code or artifacts during build](../Vulnerabilities/TamperingDuringBuild.md)

> **["Implement endpoint detection and response (EDR) tools" in CISA/NSA guide](https://media.defense.gov/2023/Jun/28/2003249466/-1/-1/0/CSI_DEFENDING_CI_CD_ENVIRONMENTS.PDF)**: EDR tools provide a high degree of visibility into the security status of endpoints and can help effectively protect against MCAs.

[🔙 Go back to the list of tutorials](../../README.md#vulnerabilities-and-countermeasures)

## Tutorials

1. [Detect File Tampering (GitHub-Hosted Runner)](#detect-file-tampering-github-hosted-runner)
2. [Detect File Tampering (Actions Runner Controller)](#detect-file-tampering-actions-runner-controller)
3. [Detect File Tampering (Self-Hosted VM Runners e.g. on EC2)](#detect-file-tampering-self-hosted-vm-runners-eg-on-ec2)

## Detect File Tampering (GitHub-Hosted Runner)

In this tutorial, you will use the `step-security/harden-runner` GitHub Action to detect file tampering on the build server in a GitHub Actions workflow.

### File Monitoring without Harden-Runner

Without Harden-Runner, you have no visibility into what files are overwritten during a workflow run.

1. Go to the `Actions` tab and run the `Hosted: File Monitoring without Harden-Runner` workflow.
2. Check out the build logs. From the build logs you see that a package was installed and a docker image was built and published.

As we will see next, one of these steps is overwritting a file, but you cannot know that without file monitoring.

### File Monitoring with Harden-Runner

1. Go to the `Actions` tab and run the `Hosted: File Monitoring with Harden-Runner` workflow.

2. View the workflow [hosted-network-monitoring-hr.yml](../../.github/workflows/hosted-file-monitor-with-hr.yml) file.

3. `step-security/harden-runner` GitHub Action is used as the first step in the job.

4. After the workflow completes, check out the build logs. In the `Harden-Runner` step, you will see a link to security insights and recommendations.

5. Click the link and you will see the `npm install` step is overwritting the `index.js` file, which is not expected.

6. You can install the [StepSecurity Actions Security GitHub App](https://github.com/apps/stepsecurity-actions-security) to get notified via email or Slack when a source code file is overwritten in your workflow.

## Detect File Tampering (Actions Runner Controller)

Actions Runner Controller (ARC) is a Kubernetes operator that orchestrates and scales self-hosted runners for GitHub Actions.

- Rather than incorporating the HardenRunner GitHub Action into each individual workflow, you install the ARC-Harden-Runner daemonset on your Kubernetes cluster.

> Please email us at support@stepsecurity.io for instructions on how to install the ARC-Harden-Runner daemonset on your Kubernetes cluster.

- Upon installation, the ARC-Harden-Runner daemonset constantly monitors file events and correlates them with each step of the workflow.

- You can access security insights and runtime detections under the `Runtime Security` tab in your dashboard

For a demo of a workflow running on ARC with Harden Runner integrated, follow this tutorial:

### File Monitoring

1. View this workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/arc-solarwinds-simulation.yml

   Notice that `harden-runner` Action is not added to this workflow, and that this workflow runs on a `self-hosted` runner.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/6285439163

3. Visit the workflow insights for this run here:
   https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/6285439163

   You can see that the file overwrite event is detected, without the need to add `harden-runner` to each job.

## Detect File Tampering (Self-Hosted VM Runners e.g. on EC2)

- Instead of adding the Harden-Runner GitHub Action in each workflow, you'll need to install the Harden-Runner agent on your runner image (e.g. AMI). This is typically done using packer.

> Please email support@stepsecurity.io for instructions on how to install the Harden-Runner agent on your runner image. This agent is different than the one used for GitHub-hosted runners.

- The Harden-Runner agent monitors file events and correlates them with each step of the workflow.

- Both ephemeral and persistent VM runners are supported.

- You can access security insights and runtime detections under the Runtime Security tab in your dashboard.

For a demo of a workflow running on self-hosted EC2 with Harden Runner integrated, follow this tutorial:

### File Monitoring

1. View this workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/self-hosted-file-monitor-with-hr.yml

   Notice that `harden-runner` Action is not added to this workflow, and that this workflow runs on a `self-hosted` runner.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/6388842742

3. Visit the workflow insights for this run here:
   https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/6388842742

   You can see that the file overwrite event is detected, without the need to add `harden-runner` to each job.
