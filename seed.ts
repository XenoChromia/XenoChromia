import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { posts, images } from './src/lib/server/db/schema'; // Adjust path as needed

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const seedData = {
    "posts": [
        {
            "id": 1,
            "template": 1,
            "title": "First Post",
            "date": "21 December 2025",
            "description": "First post :/",
            "contentParagraphs": [
                "First Post of my blog site, Hope u enjoy!",
                "sdioj"
            ],
            "images": [
                {
                    "imageId": "u892345hu89rvh89nq34g0",
                    "imageDescription": "A Image of a SBC",
                    "imageAlt": "Sample image alt text",
                    "imageLink": "https://picsum.photos/200"
                }
            ]
        },
    ]
};

async function seed() {
    const client = postgres(DATABASE_URL);
    const db = drizzle({ client });

    console.log('🌱 Starting database seeding...');

    try {
        // Clear existing data (optional - remove if you want to keep existing data)
        console.log('Clearing existing data...');
        await db.delete(images);
        await db.delete(posts);

        // Insert posts and images
        for (const post of seedData.posts) {
            console.log(`Inserting post: ${post.title}`);
            
            // Insert post
            await db.insert(posts).values({
                id: post.id,
                template: post.template,
                title: post.title,
                date: post.date,
                description: post.description,
                contentParagraphs: post.contentParagraphs
            });

            // Insert images if they exist
            if (post.images && post.images.length > 0) {
                console.log(`  Inserting ${post.images.length} images...`);
                
                for (const image of post.images) {
                    await db.insert(images).values({
                        postId: post.id,
                        imageId: image.imageId,
                        imageDescription: image.imageDescription,
                        imageAlt: image.imageAlt,
                        imageLink: image.imageLink
                    });
                }
            }
        }

        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await client.end();
    }
}

seed();
