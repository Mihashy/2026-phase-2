import { applyRuleset } from "./github-gateways/apply-ruleset"
import {
	checkRemoteOriginSettings,
	checkRemoteUpstreamSettings,
	setRemoteRepoDefault,
} from "./github-gateways/check-remote-settings"
import { createLabels } from "./github-gateways/create-labels"
import { ensureGitHubCliAvailable } from "./github-gateways/ensure-cli-available"
import { getGitHubUserName } from "./github-gateways/get-user-name"
import { inviteMentor } from "./github-gateways/invite-mentor"
import { makeCodeownersFile } from "./github-gateways/make-codeowners-file"
import { enableIssues, updateIssues } from "./github-gateways/update-issues"

async function main() {
	await ensureGitHubCliAvailable()
	const userName = await getGitHubUserName()
	await checkRemoteOriginSettings(userName)
	await checkRemoteUpstreamSettings()
	await setRemoteRepoDefault()
	await applyRuleset(userName)
	await inviteMentor(userName)
	await makeCodeownersFile()
	await createLabels(userName)
	await enableIssues(userName)
	await updateIssues(userName)
}

main()
