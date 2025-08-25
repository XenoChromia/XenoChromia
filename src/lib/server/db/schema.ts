import { pgTable, serial, integer, varchar, json, date } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});

export const blogPost = pgTable('blogPost', {
    id: serial('id').primaryKey(),
    postType: varchar("30"),
    postMessage: varchar("2000"),
    postImages: json(),
    postAuthor: varchar("255"),
    postDate: date()
})
