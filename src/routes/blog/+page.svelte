<script lang="ts">
	import { onMount } from 'svelte';

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
    onMount(async () => {
		const res = await fetch('/api/db/getPosts');
		posts = await res.json();
	});
</script>

<div class="flex h-full flex-col gap-12">
	<div
		id="header"
		class="flex h-12 w-full items-center justify-center border border-double border-indigo-500"
	>
		<h1 class="text-4xl font-bold text-white">Wai Meng's Blog Site</h1>
	</div>
	<div class="flex h-full flex-col gap-8 px-12">
		<div id="posts" class="h-full w-full">
			<h1 class="text-4xl font-semibold text-white">Blog Posts</h1>
		</div>
		<div class="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2 md:grid-cols-3 items-center h-full">
			{#each posts as post}
				<a href="/blog/{post.id}" class="flex w-full h-full justify-center cursor-pointer">
					<div class="flex flex-col items-start justify-end rounded-md bg-gray-600 p-4 text-white">
						{#if post.images}
							<div class="flex h-full w-full items-center justify-center">
								<img src={post.images[0].imageLink} alt={post.images[0].imageAlt || 'unknown'} />
							</div>
						{:else}
							<div
								class="flex h-full min-h-[200px] w-full items-center justify-center rounded-md border border-2 border-black"
							>
								<h1 class="text-4xl font-bold">NO IMAGE</h1>
							</div>
						{/if}
						<div class="flex flex-col gap-1">
							<h1 class="text-xl font-bold">{post.title}</h1>
							<h2 class="text-md">{post.description}</h2>
							<p class="text-sm">{post.contentParagraphs}</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
