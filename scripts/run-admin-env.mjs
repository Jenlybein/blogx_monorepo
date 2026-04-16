import { spawn } from "node:child_process";

const [profile, command = "dev", ...args] = process.argv.slice(2);

if (!profile) {
  console.error("Usage: node scripts/run-admin-env.mjs <profile> [nuxt-command] [...args]");
  process.exit(1);
}

const runner = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const nodeOptions = [
  process.env.NODE_OPTIONS,
  command === "build" ? "--disable-warning=DEP0155" : "",
]
  .filter(Boolean)
  .join(" ");

const child = spawn(runner, ["exec", "nuxt", command, ...args], {
  cwd: process.cwd(),
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    BLOGX_ADMIN_ENV_PROFILE: profile,
    ...(nodeOptions ? { NODE_OPTIONS: nodeOptions } : {}),
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
