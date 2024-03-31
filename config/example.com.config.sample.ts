import { SshConfig } from "../src/sshConfig"

export default new SshConfig("example.com", {
  hostname: "example.com",
  port: 22,
  user: "yuzu",
  identityFile: "~/.ssh/key1",
})
