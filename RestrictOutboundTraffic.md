<p align="left">
  <img src="https://step-security-images.s3.us-west-2.amazonaws.com/Final-Logo-06.png" alt="Step Security Logo" width="340">
</p>

# Tutorial: Restrict outbound traffic from build server

## Summary of past incidents
### Codecov breach
In early 2021, [secrets were exfiltrated](https://about.codecov.io/security-update/) from thousands of build servers, when a popular component used in build pipelines by enterprises, startups, and open source projects - Codecov bash uploader - was modified by adversaries. None of the victims detected that secrets were being exfiltrated to two IP addresses from their build servers for 2 months.

### VS Code GitHub Actions Bug Bounty Exploit
In December 2020, [ryotkak](https://twitter.com/ryotkak) exploited a command injection vulnerability in a GitHub Action to steal the `GITHUB_TOKEN` from a GitHub Actions workflow to push code to a released branch in VS Code. You can read the details [here](https://www.bleepingcomputer.com/news/security/heres-how-a-researcher-broke-into-microsoft-vs-codes-github/?&web_view=true) and [here](https://blog.ryotak.me/post/vscode-write-access/). 

## Tutorial
Goal: In this tutorial, you will learn how to prevent exfiltration of credentials from a GitHub Actions worklow. 

1. Create a fork of the repo.

2. Go to the Actions tab in the fork. Click the "I understand my workflows, go ahead and enable them" button. 
   
   <img src="https://step-security-images.s3.us-west-2.amazonaws.com/perms-enable-actions.png" alt="Enable Actions" width="800">

3. Add the `step-security/harden-runner` GitHub Action as the first step in the workflow

4. Run the workflow

5. You should see an annotation with a link to security insights and recommendations for the workflow run. 

6. Click on the link. You should see outbound traffic correlated with each step of the workflow. An outbound network policy would be recommended. 

7. Update the workflow with the policy. The first step should now look like this. 

8. Simulate an exfiltration attack similar to Codecov. In this case, you can use this statement. 

9. Run the workflow again. 

10. Observe that the call to was blocked. This shows up in the annotation as well as the link. 