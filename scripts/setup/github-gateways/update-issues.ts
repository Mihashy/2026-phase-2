import { $, file, Glob } from "bun"
import matter from "gray-matter"
import * as v from "valibot"
import { logError, logInfo } from "../utils/logger"
import { GITHUB_REPO_NAME, LABEL_NAMES, type LabelName } from "./constants"

type Issue = {
	title: string
	body: string // MarkDown
	labels: [LabelName]
	assignees: [string]
}

type IssueFrontMatter = {
	seq: number
	title: string
	difficulty: LabelName
}

const IssueFrontMatterSchema = v.object({
	seq: v.number(),
	title: v.string(),
	difficulty: v.picklist(LABEL_NAMES),
}) satisfies v.GenericSchema<IssueFrontMatter>

const issueFileNameRegExp = /^(\d{2})-([a-z-]+)\.md$/

export async function updateIssues(userName: string) {
	const existingIssueInfo = await fetchExistingIssueInfo(userName)

	const glob = new Glob("*.md")
	for await (const file of glob.scan("issues")) {
		const validationResult = await validateIssueFile(file)
		if (validationResult === null) {
			logInfo(`「${file}」はスキップされました。`)
		}
	}
}

export async function fetchExistingIssueInfo(userName: string) {
	const shellResult =
		await $`gh api /repos/${userName}/${GITHUB_REPO_NAME}/issues | jq 'map({id, title})'`
			.quiet()
			.nothrow()
	if (shellResult.exitCode !== 0) {
		logError("Issueの一覧の取得に失敗しました。")
		process.exit(1)
	}

	const jsonParser = v.array(v.object({ id: v.number(), title: v.string() }))
	const objectParser = v.pipe(
		v.object({ id: v.number(), title: v.string() }),
		v.rawTransform(({ dataset, addIssue, NEVER }) => {
			const regExpResult = dataset.value.title.match(/^#(\d+?).+$/)
			if (regExpResult === null) {
				addIssue({ message: "有効なタイトルの形式ではありません" })
				return NEVER
			}
			const seq = Number(regExpResult[1])
			return {
				id: dataset.value.id,
				seq,
			}
		}),
	)

	const jsonParseResult = v.safeParse(jsonParser, shellResult.json())
	if (!jsonParseResult.success) {
		logError("Issueの解析に失敗しました。")
		process.exit(1)
	}

	const issuesInfo: { id: number; seq: number }[] = []

	for (const issueInfo of jsonParseResult.output) {
		const objectParseResult = v.safeParse(objectParser, issueInfo)
		if (!objectParseResult.success) continue
		issuesInfo.push(objectParseResult.output)
	}

	return issuesInfo
}

async function validateIssueFile(
	fileName: string,
): Promise<(IssueFrontMatter & { content: string }) | null> {
	// ファイル名のパターンマッチ
	const matchResult = fileName.match(issueFileNameRegExp)
	if (matchResult === null) return null

	const seqNumber = Number(matchResult[1])
	// 英語の短縮名
	const _issueName = matchResult[2]

	// フロントマターをパース
	const issueFile = file(`issues/${fileName}`)
	const { data, content } = matter(await issueFile.text())
	const validationResult = v.safeParse(IssueFrontMatterSchema, data)
	if (!validationResult.success) return null
	const frontMatter: IssueFrontMatter = validationResult.output
	if (seqNumber !== frontMatter.seq) return null

	return { ...frontMatter, content }
}
