import { ensureGitHubCliAvailable } from "./github-gateways/ensure-cli-available"
import { getGitHubUserName } from "./github-gateways/get-user-name"

async function main() {
	await ensureGitHubCliAvailable()
	const userName = await getGitHubUserName()
	// await checkRemoteOriginSettings(userName)
	// await checkRemoteUpstreamSettings()
}

main()
