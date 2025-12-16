<script lang="ts">
	type Timage = {
		imageId: string;
		imageDescription: string;
		imageAlt: string;
		imageLink: string;
	};
	type Tposts = {
		id: number;
		title: string;
		description: string;
		contentParagraphs: string[];
		images?: Timage[];
	};
	let posts: Tposts[] = [
		{
			id: 1,
			title: 'Test',
			description: 'This is a test post',
			contentParagraphs: ['Hello this is a test paragraph1', 'Hello this is a test paragraph2']
		},
		{
			id: 2,
			title: 'Test2',
			description: 'This is a test post2',
			contentParagraphs: ['Hello this is a test paragraph1', 'Hello this is a test paragraph2'],
			images: [
				{
					imageId: 'img1',
					imageDescription: 'description',
					imageAlt: 'this is image alt',
					imageLink: 'https://picsum.photos/200/300'
				}
			]
		}
	];
	console.log(posts);
</script>

<div class="h-full">
	<div
		id="header"
		class="h-12 w-full items-center justify-center border border-solid border-indigo-600"
	>
		<h1 class="inline-flex text-white">hello world</h1>
	</div>
	<div id="posts" class="h-full w-full">
		<h1 class="text-white">Blog Posts</h1>
	</div>
	{#each posts as post}
		<div class="text-white bg-gray-600">
			<h1>{post.title}</h1>
			<h2>{post.description}</h2>
			<p>{post.contentParagraphs}</p>
			{#if post.images}
				<img src={post.images[0].imageLink} alt={post.images[0].imageAlt || 'unknown'} />
			{/if}
		</div>
	{/each}
</div>
