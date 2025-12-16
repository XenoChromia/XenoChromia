import type { PageServerLoad } from './$types';

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
let posts: Tposts[] = [
    {
        id: 1,
        template: 2,
        title: 'Test',
        description: 'This is a test post',
        contentParagraphs: ['Hello this is a test paragraph1', 'Hello this is a test paragraph2']
    },
    {
        id: 2,
        template: 1,
        title: 'Test2',
        description: 'This is a test post2',
        contentParagraphs: ['Hello this is a test paragraph1', 'Hello this is a test paragraph2'],
        images: [
            {
                imageId: 'img1',
                imageDescription: 'description',
                imageAlt: 'this is image alt',
                imageLink: 'https://picsum.photos/200'
            }
        ]
    }
];


export const load: PageServerLoad = async ({ params }) => {
    const { id } = params;

    let postTemplateType: number = posts[1].template

    return {
        id,
        postTemplateType
    };
};

