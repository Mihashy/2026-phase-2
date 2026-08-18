import { checkRemoteOriginSettings } from "./github-gateways/check-remote-settings"
import { GITHUB_WINC_OWNER_ID } from "./github-gateways/constants"
import { ensureGitHubCliAvailable } from "./github-gateways/ensure-cli-available"
import { getGitHubUserName } from "./github-gateways/get-user-name"

async function main() {
	await ensureGitHubCliAvailable()
	const userName = await getGitHubUserName()
	// await checkRemoteOriginSettings(userName)
	await checkRemoteOriginSettings(GITHUB_WINC_OWNER_ID)
}

main()
