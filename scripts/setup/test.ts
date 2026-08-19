// await createLabels("Hattori-1104")

import { fetchExistingIssueInfo } from "./github-gateways/update-issues"

// const issue0 = file("./issues/01-env.md")
// console.log(matter(await issue0.text()).data)

// console.log(await $`ls ./issues`.quiet().text())

// const glob = new Glob("./issues/*.md")
// const scannedFiles = glob.scan()
// console.log(scannedFiles)

// const glob = new Glob("*.md")

// for await (const file of glob.scan("./issues")) {
// 	console.log(file)
// }

// await updateIssues("Hattori-1104")

console.log(await fetchExistingIssueInfo("Hattori-1104"))
