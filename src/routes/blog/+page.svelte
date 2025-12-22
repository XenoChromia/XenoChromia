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
        date: string;
        year: string;
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

<div class="flex h-full min-h-screen flex-col gap-12">
	<div
		id="header"
		class="flex h-12 w-full items-center justify-center"
	>
		<h1 class="text-4xl font-bold text-white">Wai Meng's Blog Site</h1>
	</div>
	<div class="flex h-full flex-col gap-2 px-2">
		<div id="posts" class="h-full w-full">
			<h1 class="text-4xl font-semibold text-white">Posts</h1>
		</div>
		<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 items-center h-full">
			{#each posts as post}
				<a href="/blog/{post.id}" class="flex w-full h-full justify-center cursor-pointer">
					<div class="flex flex-col items-start justify-end rounded-md border border-solid border-gray-200 p-4 text-white gap-8">
						{#if post.images?.length > 0}
							<div class="flex h-full w-full items-center justify-center">
								<img src={post.images[0].imageLink} alt={post.images[0].imageAlt || 'unknown'}/>
							</div>
						{:else}
							<div
								class="flex h-full min-h-[200px] w-full items-center justify-center rounded-md border border-2 border-black"
							>
								<h1 class="text-4xl font-bold">NO IMAGE</h1>
							</div>
						{/if}
						<div class="flex flex-col gap-1 h-full">
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
