// src/routes/+page.server.ts
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export async function load() {
  const art = readFileSync(join(process.cwd(), 'static', 'art.txt'), 'utf-8');
  return { art };
}
