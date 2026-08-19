import { $ } from "bun"
import { logError, logInfo } from "../utils/logger"

export async function syncUpstreamMain() {
	const checkoutResult = await $`git checkout main`.quiet().nothrow()
	if (checkoutResult.exitCode !== 0) {
		logError("ブランチ「main」への切り替えに失敗しました。")
		process.exit(1)
	}

	const pullResult = await $`git pull upstream main`.quiet().nothrow()
	if (pullResult.exitCode !== 0) {
		logError("リモート「upstream」の「main」からのpullに失敗しました。")
		process.exit(1)
	}

	const pushResult = await $`git push origin main`.quiet().nothrow()
	if (pushResult.exitCode !== 0) {
		logError("リモート「origin」の「main」へのpushに失敗しました。")
		process.exit(1)
	}

	logInfo("リモート「upstream」の「main」の変更を取り込みました。")
}
