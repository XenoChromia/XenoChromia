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
	
	let post: Tposts | null = null;
	let error: string | null = null;
	
	onMount(async () => {
		try {
			const res = await fetch('/api/db/getPosts');
			if (!res.ok) throw new Error('Failed to fetch posts');
			const data = await res.json();
			const postId = Number(id);
			const foundPost = data.find((p: Tposts) => p.id === postId);
			
			if (!foundPost) {
				error = `Post with id ${id} not found`;
			} else {
				post = foundPost;
			}
		} catch (e: any) {
			error = e.message;
		}
	});
</script>

{#if error}
	<div class="container">
		<p class="error">{error}</p>
	</div>
{:else if !post}
	<div class="container">
		<p class="loading">Loading...</p>
	</div>
{:else}
	<div class="container min-h-screen">
		<a href="/blog" class="back-link">← Back</a>
		
		<h1>{post.title}</h1>
		<div class="date">{post.date}</div>
		
		{#if post.images && post.images.length > 0}
			<div class="hero-image">
				<img src={post.images[0].imageLink} alt={post.images[0].imageAlt} />
			</div>
			<p class="caption">{post.images[0].imageDescription}</p>
		{/if}
		
		<h2 class="description">{post.description}</h2>
		
		{#each post.contentParagraphs as para, i}
			<p class="content-para">{para}</p>
			
			{#if post.images && post.images.length > 1 && i === Math.floor(post.contentParagraphs.length / 2)}
				<div class="inline-image">
					<img src={post.images[1].imageLink} alt={post.images[1].imageAlt} />
				</div>
				<p class="caption">{post.images[1].imageDescription}</p>
			{/if}
		{/each}
		
		{#if post.images && post.images.length > 2}
			{#each post.images.slice(2) as img}
				<div class="inline-image">
					<img src={img.imageLink} alt={img.imageAlt} />
				</div>
				<p class="caption">{img.imageDescription}</p>
			{/each}
		{/if}
	</div>
{/if}

<style>
	:global(body) {
		font-family: Arial, sans-serif;
		line-height: 1.6;
		color: #ffffff;
		background: #000000;
		padding: 20px;
		margin: 0;
	}
	
	.container {
		max-width: 700px;
		margin: 0 auto;
	}
	
	.back-link {
		color: #888;
		text-decoration: none;
		display: inline-block;
		margin-bottom: 20px;
	}
	
	.back-link:hover {
		color: #fff;
	}
	
	h1 {
		font-size: 2rem;
		margin-bottom: 10px;
	}
	
	.date {
		color: #888;
		margin-bottom: 30px;
		font-size: 0.9rem;
	}
	
	.hero-image {
		width: 100%;
		margin: 30px 0 10px 0;
	}
	
	.hero-image img {
		width: 100%;
		height: auto;
		display: block;
	}
	
	.inline-image {
		width: 100%;
		margin: 30px 0 10px 0;
	}
	
	.inline-image img {
		width: 100%;
		height: auto;
		display: block;
	}
	
	.caption {
		text-align: center;
		color: #888;
		font-size: 0.9rem;
		margin-bottom: 30px;
	}
	
	.description {
		font-size: 1.2rem;
		font-weight: normal;
		margin-bottom: 20px;
		color: #ccc;
	}
	
	.content-para {
		margin-bottom: 20px;
		font-size: 1rem;
	}
	
	.error {
		color: #ff6b6b;
	}
	
	.loading {
		color: #888;
	}
</style>
