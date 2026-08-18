// await createLabels("Hattori-1104")

import { file } from "bun"
import matter from "gray-matter"

const issue0 = file("./issues/01-env.md")
console.log(matter(await issue0.text()).data)
