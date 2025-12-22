import { json } from '@sveltejs/kit';
import { getAllPosts} from '$lib/server/db/queries.ts';

export async function GET() {
    const data = await getAllPosts();
    return json(data);
}
