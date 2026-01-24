import { existsSync, unlinkSync } from "node:fs";
import process from "node:process";

// Delete package-lock.json immediately if it exists
if (existsSync("package-lock.json")) {
  unlinkSync("package-lock.json");
  console.log("🔥 package-lock.json deleted");
}

const ua = process.env.npm_config_user_agent || "";

if (!ua.includes("yarn")) {
  console.error(`
🚫 ERROR: This project requires YARN

Detected: ${ua.split(" ")[0]}

✅ Use: yarn install
❌ Not: npm install
`);
  process.exit(1);
}