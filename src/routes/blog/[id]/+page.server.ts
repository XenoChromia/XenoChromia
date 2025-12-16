import type { PageServerLoad } from './$types';
import postsData from '$lib/server/db/posts.json';

type Timage = {
    imageId: string;
    imageDescription: string;
    imageAlt: string;
    imageLink: string;
};
type Tposts = {
    id: number;
    template: number;
    title: string;
    description: string;
    contentParagraphs: string[];
    images?: Timage[];
};
let posts: Tposts[] = []

export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;
    const postId = Number(id);
    const posts: Tposts[] = postsData.posts[0];

    let postTemplateType: number = posts.template
    
    return {
        id,
        postTemplateType
    };
};

