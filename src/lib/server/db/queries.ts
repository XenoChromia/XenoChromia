import { db } from './index.ts';
import { posts, images } from './schema';
import { eq } from 'drizzle-orm';

export async function getAllPosts() {
    const results = await db.query.posts.findMany({
        with: {
            images: true
        }
    });
    // const results = await db.select().from(posts);
    return results
}

export async function getPostById(id: number) {
    return db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
            images: true
        }
    });
}

export async function createPost(data: {
    template: number;
    title: string;
    description: string;
    contentParagraphs: string[];
}) {
    const [post] = await db
    .insert(posts)
    .values(data)
    .returning();

    return post;
}

export async function addImageToPost(data: {
    imageId: string;
    postId: number;
    imageDescription: string;
    imageAlt: string;
    imageLink: string;
}) {
    return db.insert(images).values(data);
}

export async function deletePost(id: number) {
    return db.delete(posts).where(eq(posts.id, id));
}

