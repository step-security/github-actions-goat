# GitHub Actions Runtime Security - Detect File Tampering

For examples of real-world incidents in which files have been tampered during CI/CD pipelines, refer to [TamperingDuringBuild](#)

## Tutorial

Learn how to detect file modification on the build server in a GitHub Actions workflow.

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button.

   <img src="../images/EnableActions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the [ci.yml](../.github/workflows/ci.yml) file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step. After the checkout step, add another step to simulate modification of a source code file, and another to simulate `sudo` call. The updated file should look like this:

   ```yaml
   name: Test and coverage

   on: [push, pull_request, workflow_dispatch]

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: step-security/harden-runner@v2
           with:
             egress-policy: audit
             disable-sudo: true
         - uses: actions/checkout@v2
           with:
             fetch-depth: 2
         - run: | # simulate modification of source code
             code='package calc\n\nfunc Add(x, y int) int {\nprintln("code added")\nreturn x + y\n}'
             printf "$code" > calc1.go
             mv calc1.go calc.go
         - uses: actions/setup-go@v2
           with:
             go-version: "1.17"
         - name: Run coverage
           run: go test -race -coverprofile=coverage.txt -covermode=atomic
         - name: Simulate sudo access
           run: sudo ls
         - name: Upload coverage to Codecov
           run: |
             bash <(curl -s https://codecov.io/bash)
   ```

Commit the changes to `main` branch.

4. The `step-security/harden-runner` GitHub Action installs an agent into the Ubuntu VM that monitors changes to source code. In a typical workflow, source code is checked out from the repository and does not need to be altered. In this case, since it is altered, the change will be detected.

5. This change should cause the workflow to run, as it is set to run on push. Click on the `Actions` tab and then click on the `Test and coverage` workflow run.

6. You should see a link to security insights and recommendations for the workflow run under the `Run step-security/harden-runner` tab.

<img src="../images/InsightsLink.png" alt="Link to security insights" width="800">

7. Click on the link. You should see that the file overwrite has been detected.

<img src="../images/SourceCodeOverwriteDetected.png" alt="Source code overwrite detected" width="800">

8. In the Action steps, notice that the `sudo` step failed, since `disable-sudo: true` was set using harden-runner.

9. This shows how [`Harden-Runner`](https://github.com/step-security/harden-runner) prevents malicious steps from calling `sudo` and detects file overwrites during build.

10. You can install the [Harden Runner App](https://github.com/marketplace/harden-runner-app) to get notified via email or Slack when a source code file is overwritten in your workflow.

## Using Harden Runner with ARC (Actions Runner Controller) for Self-Hosted Kubernetes Runners

For those utilizing Actions Runner Controller (ARC) in a Kubernetes environment for self-hosted runners, the procedure to integrate Harden Runner varies slightly. Rather than incorporating the Harden Runner step into each individual workflow, you'll need to install the ARC Harden Runner DaemonSet on your Kubernetes cluster.

ARC is a Kubernetes controller for GitHub Actions self-hosted runners and its use allows Harden Runner to automatically integrate across all your existing GitHub Actions workflows without the need to individually modify each one.

To see an example of a workflow running on a Kubernetes self-hosted runner with Harden Runner integrated, please refer to this [link](#) (to be updated).

Upon deployment, the ARC Harden Runner DaemonSet constantly monitors for any modifications to the source code files during your workflows, detecting any unauthorized changes promptly.

For ARC-based self-hosted runners, the location to find security insights and recommendations is different from GitHub-hosted runners. These insights can be accessed under the Runtime Security tab in the dashboard at [app.stepsecurity.io](#) (to be updated).

Lastly, remember that to leverage Harden Runner with ARC-based self-hosted runners, installation of the [Harden Runner App](https://github.com/marketplace/harden-runner-app) is necessary. With the app installed, you'll receive notifications via email or Slack whenever a source code file is overwritten in your workflow.
