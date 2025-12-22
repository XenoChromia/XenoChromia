<script lang="ts">
	import { onMount } from 'svelte';

	export let id: number;

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
		description: string;
		contentParagraphs: string[];
		images?: Timage[];
	};

	let posts: Tposts[] | null = null;
	let error: string | null = null;
    let post: Tposts;

	onMount(async () => {
		try {
			const res = await fetch(`/api/db/getPosts`);
			if (!res.ok) throw new Error('Failed to fetch posts');
			const data = await res.json(); // assuming { posts: [...] }
			const postId = Number(id);

            post = data.find(p => p.id === postId);

			if (!post) {
				error = `Post with id ${id} not found`;
			}
		} catch (e: any) {
			error = e.message;
		}
	});
</script>

{#if error}
	<p class="text-red-500">{error}</p>
{:else if !post}
	<p>Loading...</p>
{:else}
	<div class="container text-white min-h-screen">
		<a href="/blog">← Back</a>

		<h1>{post.title}</h1>
		<div class="date">{post.date}</div>
		{#if post.images}
			<div class="flex w-full justify-center">
				<img src={post.images[0].imageLink} alt={post.images[0].imageAlt} width="500" />
			</div>
			<p class="text-[#888]">{post.images[0].imageDescription}</p>
		{/if}

		<h2 class="text-md">{post.description}</h2>

		{#each post.contentParagraphs as para}
			<p class="text-sm">{para}</p>
		{/each}

		{#if post.images}
			{#each post.images as img}
				<img src={img.imageLink} alt={img.imageAlt} />
				<p>{img.imageDescription}</p>
			{/each}
		{/if}
	</div>
{/if}

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	body {
		font-family: Arial, sans-serif;
		line-height: 1.6;
		color: #ffffff;
		background: #000000;
		padding: 20px;
	}

	.container {
		max-width: 700px;
		margin: 0 auto;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 10px;
	}

	.date {
		color: #888;
		margin-bottom: 30px;
	}

	p {
		margin-bottom: 20px;
	}

	a {
		color: #888;
		text-decoration: none;
	}

	a:hover {
		color: #fff;
	}
</style>
