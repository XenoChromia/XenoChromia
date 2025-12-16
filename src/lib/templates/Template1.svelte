<script lang="ts">
	export let id: string;
</script>

<div class="container text-white">
	<a href="/blog">← Back</a>

	<h1>Blog Post Title</h1>
	<div class="date">December 16, 2025</div>
	<p>Template 1 – ID: {id}</p>

	<p>
		This is the first paragraph of the blog post. Lorem ipsum dolor sit amet, consectetur adipiscing
		elit.
	</p>

	<p>
		This is another paragraph with more content. Sed do eiusmod tempor incididunt ut labore et
		dolore magna aliqua.
	</p>

	<p>You can add as many paragraphs as needed for your blog post content.</p>

	<p>
		Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat.
	</p>
</div>

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
