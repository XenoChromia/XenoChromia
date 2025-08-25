// src/routes/+page.server.ts
export async function load({ fetch }) {
  const res = await fetch("/art.txt"); // served from static/
  const art = await res.text();
  return { art };
}

