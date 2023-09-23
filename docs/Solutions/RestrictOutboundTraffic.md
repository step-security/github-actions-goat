# GitHub Actions Runtime Security - Filter Network Traffic

> For examples of real-world incidents in which credentials have been exfiltrated from CI/CD pipelines, refer to [Exfiltration of secrets from the CI/ CD pipeline](../Vulnerabilities/ExfiltratingCICDSecrets.md)

## Tutorials

1. [Filter Network Traffic (GitHub-hosted Runner)](#filter-network-traffic-github-hosted-runner)
2. [Filter Network Traffic (Actions Runner Controller)](#filter-network-traffic-actions-runner-controller)

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

You can now see that the `npm install` step is making a call to `pastebin.com`, which is not expected.

### Network Filtering with Harden-Runner

In the insights page, you will see a recommended policy to filter egress traffic to allowed destinations.

1. Go to the `Actions` tab and run the `Hosted: Network Filtering with Harden-Runner` workflow.
2. View the workflow [hosted-network-filtering-hr.yml](../../.github/workflows/hosted-network-filtering-hr.yml) file.
3. `step-security/harden-runner` GitHub Action has `egress-policy` set to `block`. Only the destinations that are expected are in the allowed list. `pastebin.com` is not in this list.
4. After the workflow completes, check out the build logs.
5. Click the insights link from the `Harden-Runner` step. You will notice that the call to `pastebin.com` was blocked in this case.
6. You can also install the [StepSecurity Actions Security GitHub App](https://github.com/apps/stepsecurity-actions-security) to get notified via email or Slack when outbound traffic is blocked. This App is required if you use `Harden-Runner` for private repositories.

## Filter Network Traffic (Actions Runner Controller)

Actions Runner Controller (ARC) is a Kubernetes operator that orchestrates and scales self-hosted runners for GitHub Actions.

- Rather than incorporating the HardenRunner GitHub Action into each individual workflow, you install the ARC-Harden-Runner daemonset on your Kubernetes cluster.

- Upon installation, the ARC-Harden-Runner daemonset constantly monitors the outbound calls and correlates them with each step of the workflow.

- You can access security insights and runtime detections under the `Runtime Security` tab in your dashboard

For a demo of a workflow running on ARC with Harden Runner integrated, follow this tutorial:

### Network Monitoring

1. View this workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/arc-zero-effort-observability.yml

   Notice that `harden-runner` Action is not added to this workflow, and that this workflow runs on a `self-hosted` runner.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/6141448568

3. Visit the workflow insights for this run here:
   https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/6141448568
   You can see the outbound traffic for each of the steps, without the need to add `harden-runner` to each job.

Even though you do not need to add Harden-Runner Action, the insights are exactly the same as with GitHub-Hosted runner.

### Network Filtering with Harden Runner

To filter traffic in self-hosted ARC runner, you use the `harden-runner` GitHub Action in `block` mode.

1. View the workflow file:
   https://github.com/step-security/github-actions-goat/blob/main/.github/workflows/arc-codecov-simulation.yml

   Notice that `harden-runner` Action is added and there is a list of allowed endpoints.

2. Check out an example run of this workflow here:
   https://github.com/step-security/github-actions-goat/actions/runs/5662626256/job/15342958122

   Notice that the call to `pastebin.com` has been blocked.

3. Visit the workflow insights for this run here: https://app.stepsecurity.io/github/step-security/github-actions-goat/actions/runs/5662626256

As you can observe, the outbound call that was not in the allowed list was successfully blocked.
