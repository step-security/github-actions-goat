<p align="left">
  <img src="https://step-security-images.s3.us-west-2.amazonaws.com/Final-Logo-06.png" alt="Step Security Logo" width="340">
</p>

# Tutorial: Restrict outbound traffic from build server

## Summary of past incidents
### Codecov breach
In early 2021, [secrets were exfiltrated](https://about.codecov.io/security-update/) from thousands of build servers, when a popular component used in build pipelines by enterprises, startups, and open source projects - Codecov bash uploader - was modified by adversaries. None of the victims detected that secrets were being exfiltrated to two IP addresses from their build servers for 2 months.

### VS Code GitHub Actions Exploit
In December 2020, [ryotkak](https://twitter.com/ryotkak) reported as part of the Bug Bounty program how he exfiltrated the `GITHUB_TOKEN` from a GitHub Actions workflow. You can read the details [here](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/?&web_view=true) and [here](https://blog.ryotak.me/post/vscode-write-access/). 

## Tutorial
Learn how to prevent exfiltration of credentials from a GitHub Actions worklow. 

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button. 
   
   <img src="https://step-security-images.s3.us-west-2.amazonaws.com/perms-enable-actions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the `ci.yml` file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step. Commit the changes either to `main` branch or any other branch.  

    ```
    - uses: step-security/harden-runner@v1
      with:
        egress-policy: audit
    ```

4. This change should cause the workflow to run, as it is set to run on push. Click on the `Actions` tab to view the workflow run. 

5. You should see a link to security insights and recommendations for the workflow run. 

6. Click on the link. You should see outbound traffic correlated with each step of the workflow. An outbound network policy would be recommended. 

7. Update the `ci.yml` workflow with the policy. The first step should now look like this. From now on, outbound traffic will be restricted to only these domains for this workflow. 

    ```
    - uses: step-security/harden-runner@v1
      with:
        allowed-endpoints: 
          codecov.io:443
          github.com:443
          storage.googleapis.com:443
    ```

8. Simulate an exfiltration attack similar to Codecov. Update the workflow and add the following statement. The bash uploader is no longer vulnerable, but when it was, it would have made an additional outbound call, which is being simulated here. 

    ```
    - name: Upload coverage to Codecov
      run: |
        bash <(curl -s https://codecov.io/bash)
        curl https://www.stepsecurity.io   
    ```

9. This change should cause the workflow to run, as it is set to run on push.

10. Observe that the workflow fails because the call is blocked. Click the link to security insights. You can see that blocked calls are shown in Red color in the insights page. 