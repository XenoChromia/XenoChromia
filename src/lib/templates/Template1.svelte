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
		description: string;
		contentParagraphs: string[];
		images?: Timage[];
	};

	let post: Tposts | null = null;
	let error: string | null = null;

	onMount(async () => {
		try {
			const res = await fetch(`/api/db/getPosts`);
			if (!res.ok) throw new Error('Failed to fetch posts');
			const data = await res.json(); // assuming { posts: [...] }
			const postId = Number(id) - 1;
			console.log(data);
			post = data[postId];

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
	<div class="container text-white">
		<a href="/blog">← Back</a>

		<h1>{post.title}</h1>
		<div class="date">December 16, 2025</div>
		{#if post.images}
			<div class="w-full flex justify-center">
				<img src={post.images[0].imageLink} alt={post.images[0].imageAlt} width="500" />
			</div>
			<p>{post.images[0].imageDescription}</p>
		{/if}

		<p>{post.description}</p>

		{#each post.contentParagraphs as para}
			<p>{para}</p>
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
