import * as fs from "node:fs/promises"
import * as path from "node:path"
import { parseArgs } from "node:util"
import untildify from "untildify"
import { SshConfigFile } from "../sshConfigFile"

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    config: {
      type: "string",
    },
    output: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
})

if (!values.config) {
  console.error(
    `The '--config=' option is not specified. Please provide the directory path containing the configuration files using '--config=<path_to_directory>'.`,
  )
  process.exit(1)
}

const cwd = process.cwd()
const directoryPath = path.resolve(cwd, untildify(values.config))
const fileNames = (await fs.readdir(directoryPath)).filter((file) =>
  file.endsWith(".config.ts"),
)

const configFile = new SshConfigFile("config.txt")

for (const name of fileNames) {
  const conf = await import(path.join(directoryPath, name)).then(
    (module) => module.default,
  )
  configFile.add(conf)
}

const outputPath = values.output
  ? path.resolve(cwd, untildify(values.output))
  : undefined
configFile.generate(outputPath).catch((e) => console.error(e))
