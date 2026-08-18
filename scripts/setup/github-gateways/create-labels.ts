import { $ } from "bun"
import { logError, logInfo } from "../utils/logger"
import {
	GITHUB_REPO_NAME,
	LABEL_COLORS,
	LABEL_DESCRIPTIONS,
	LABEL_NAMES,
} from "./constants"

export async function createLabels(userName: string) {
	logInfo("ラベルを取得しています...")
	const shellListResult =
		await $`gh api /repos/${userName}/${GITHUB_REPO_NAME}/labels`
			.quiet()
			.nothrow()
	if (shellListResult.exitCode !== 0) {
		logError("ラベルの取得に失敗しました。")
		process.exit(1)
	}
	const existingLabels = shellListResult.json() as {
		id: number
		name: string
	}[]
	const existingLabelSet = new Set(
		existingLabels.map((existing) => existing.name),
	)
	const labelsSet = new Set(LABEL_NAMES)
	const nonExistentLabelSet = labelsSet.difference(existingLabelSet)

	if (nonExistentLabelSet.size === 0) {
		logInfo("すでにラベルは作成済みです。")
		return
	}

	logInfo("ラベルを作成しています...")
	const promises = [...nonExistentLabelSet].map((label) => {
		return $`gh api --method POST /repos/${userName}/${GITHUB_REPO_NAME}/labels -f 'name='${label}' -f 'description=${LABEL_DESCRIPTIONS[label]}' -f 'color=${LABEL_COLORS[label]}'`.quiet()
	})

	try {
		await Promise.all([promises])
	} catch {
		logError("ラベルの作成に失敗しました。")
		process.exit(1)
	}

	logInfo("ラベルの作成を完了しました。")
}
