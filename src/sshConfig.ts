import * as v from "valibot"
import IsFqdn from "validator/lib/isFQDN"

export interface Config {
  toConfigFileText(): string
  validation(): Promise<void>
}

export const SshConfigSchema = v.object({
  hostname: v.union([
    v.string([v.ip()]),
    v.string([v.custom((value) => IsFqdn(value))]),
  ]),
  port: v.optional(v.number()),
  user: v.optional(v.string()),
  identityFile: v.optional(v.string()),
  serverAliveInterval: v.optional(v.number([v.minValue(1)])),
  serverAliveCountMax: v.optional(v.number([v.minValue(1)])),
})

type SshConfigSchema = v.Input<typeof SshConfigSchema>

export class SshConfig implements Config {
  constructor(
    public host: string,
    public config: SshConfigSchema,
  ) {}

  async validation(): Promise<void> {
    v.parseAsync(SshConfigSchema, this.config)
  }

  toConfigFileText(): string {
    const {
      hostname,
      port,
      user,
      identityFile,
      serverAliveCountMax,
      serverAliveInterval,
    } = this.config
    const text: string[] = []

    const space = " ".repeat(2)
    text.push(`Host ${this.host}`)
    text.push(`${space}HostName ${hostname}`)
    if (port) {
      text.push(`${space}Port ${port}`)
    }

    if (user) {
      text.push(`${space}User ${user}`)
    }

    if (identityFile) {
      text.push(`${space}IdentityFile ${identityFile}`)
    }

    if (serverAliveInterval) {
      text.push(`${space}ServerAliveInterval ${serverAliveInterval}`)
    }

    if (serverAliveCountMax) {
      text.push(`${space}ServerAliveCountMax ${serverAliveCountMax}`)
    }

    return text.join("\n")
  }
}
