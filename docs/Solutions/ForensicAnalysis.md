# Forensically Reconstruct An Incident Post-Compromise

> **["Keep audit logs" section in CISA/NSA guide](https://media.defense.gov/2023/Jun/28/2003249466/-1/-1/0/CSI_DEFENDING_CI_CD_ENVIRONMENTS.PDF)**: An audit log should provide clear information on who committed, reviewed, and deployed what, when, and where. If all previous measures fail, an audit log will at least help **forensically reconstruct an incident post-compromise**, so it can be quickly addressed

[🔙 Go back to the list of tutorials](../../README.md#vulnerabilities-and-countermeasures)

## Tutorial

In this tutorial, you will simulate an attack scenario, in which an attacker runs a workflow to exfiltrate CI/CD Secrets and then deletes the workflow run to remove evidence of the run.

This can happen if a developer's credentials or a Personal Access Token (PAT) has been compromised, and then used to exfiltrate CI/CD Secrets.

You will then locate the record for the worflow run in the StepSecurity dashboard and use it for forensic analysis.

1. Go to the `Actions` tab and run the `Hosted: Network Monitoring with Harden-Runner` workflow. This is similar to an attacker with `write` access to the repository creating and running a workflow.

2. Now do to the workflow run, click on the `...` next to it, and click on `Delete workflow run`. Now there is no evidence that this workflow ran.

3. Now, to conduct forensic analysis, go to the `StepSecurity Dashboard` and click on the `Runtime Security` tab.

4. You should see a record for the workflow run and can click on it to view the outbound calls made during the run, and what process made the call.

5. This is important forensic information that can help confirm the incident, and identify the step and the process that exfiltrated secrets. It can also be used to understand who ran the workflow to identify whose credentials have been compromised.
