import { write } from "bun"
import { logInfo } from "../utils/logger"
import { MENTORS } from "./constants"

export async function makeCodeownersFile() {
	await write(".github/CODEOWNERS", `* ${MENTORS.join(" ")}`)
	logInfo(".github/CODEOWNERS ファイルを作成しました。")
}
