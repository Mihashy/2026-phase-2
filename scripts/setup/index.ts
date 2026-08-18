import { ensureGitHubCliAvailable } from "./github-gateways/ensure-cli-available";

async function main() {
  await ensureGitHubCliAvailable()
}

main()