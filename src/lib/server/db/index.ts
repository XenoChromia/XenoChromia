import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Postgres connection for the blog's optional database path.
 *
 * NOTE: the blog no longer reads through this. `$lib/server/posts.ts` serves
 * `posts.json`, so the site renders with no database service running. This
 * module is kept for a future move to a real database and is imported only by
 * the `/api/db/*` routes.
 *
 * The URL is asserted rather than validated at import time on purpose:
 * SvelteKit evaluates route modules during `npm run build`, so throwing here
 * failed the build on any machine without DATABASE_URL — including the
 * production build of a blog that does not need a database at all.
 */
const url = process.env.DATABASE_URL as string;

const queryClient = postgres(url);

export const db = drizzle({
	client: queryClient,
	schema
});
