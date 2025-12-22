import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schema.ts"

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle({ 
    client: queryClient, 
    schema
});
// const result = await db.execute('select 1');

