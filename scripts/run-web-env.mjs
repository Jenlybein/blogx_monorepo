import { spawn } from "node:child_process";

const [profile, command = "dev", ...args] = process.argv.slice(2);

if (!profile) {
  console.error("Usage: node scripts/run-web-env.mjs <profile> [nuxt-command] [...args]");
  process.exit(1);
}

const runner = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const nodeOptions = [
  process.env.NODE_OPTIONS,
  // Nuxt/Nitro 4.4.x currently emits an upstream DEP0155 warning from its bundled error template.
  // Keep the suppression scoped to build commands so local deprecation signals remain visible in dev.
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
    BLOGX_WEB_ENV_PROFILE: profile,
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
