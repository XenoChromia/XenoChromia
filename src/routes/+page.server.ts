// src/routes/+page.server.ts
import fs from "fs";
import path from "path";

export async function load() {
  const file = fs.readFileSync(path.resolve("static/art.txt"), "utf-8");
  return { art: file };
}

