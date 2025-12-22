import {
    pgTable,
    serial,
    integer,
    text,
    varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    template: integer('template').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    contentParagraphs: text('content_paragraphs').array().notNull()
});

export const images = pgTable('images', {
    imageId: varchar('image_id', { length: 100 }).primaryKey(),
    postId: integer('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
        imageDescription: text('image_description').notNull(),
    imageAlt: text('image_alt').notNull(),
    imageLink: text('image_link').notNull()
});

export const postsRelations = relations(posts, ({ many }) => ({
  images: many(images)
}));

export const imagesRelations = relations(images, ({ one }) => ({
  post: one(posts, {
    fields: [images.postId],
    references: [posts.id]
  })
}));

// export const postsRelations = defineRelations({ images, posts }, (r) => ({
//   posts: {
//     images: r.many.images({
//       from: r.posts.id,
//       to: r.images.postId,
//     }),
//   },
//   images: {
//     post: r.one.posts({
//       from: r.images.postId,
//       to: r.posts.id,
//     }),
//   },
// }));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;
