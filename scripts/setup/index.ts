import { applyRuleset } from "./github-gateways/apply-ruleset"
import { setRemoteRepoDefault } from "./github-gateways/check-remote-settings"
import { ensureGitHubCliAvailable } from "./github-gateways/ensure-cli-available"
import { getGitHubUserName } from "./github-gateways/get-user-name"
import { inviteMentor } from "./github-gateways/invite-mentor"
import { makeCodeownersFile } from "./github-gateways/make-codeowners-file"

async function main() {
	await ensureGitHubCliAvailable()
	const userName = await getGitHubUserName()
	// await checkRemoteOriginSettings(userName)
	// await checkRemoteUpstreamSettings()
	await setRemoteRepoDefault()
	await applyRuleset(userName)
	await inviteMentor(userName)
	await makeCodeownersFile()
}

main()
