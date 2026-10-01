<script lang="ts">
	import { page } from '$app/state';

	const heading = $derived(page.status === 404 ? 'Page not found' : 'Something went wrong');
</script>

<!--
	Designed error state. Without this file SvelteKit renders its own bare
	"404 Not Found" text, which is the only place a visitor saw unstyled
	browser chrome.
-->
<svelte:head>
	<title>{heading} — Wai Meng Leong</title>
</svelte:head>

<div class="mx-auto flex min-h-[70dvh] max-w-2xl flex-col justify-center gap-4 px-6 py-14 lg:px-10">
	<p class="font-mono text-xs tracking-widest text-danger uppercase">
		Error {page.status}
	</p>
	<h1 class="font-mono text-3xl font-bold tracking-tight text-body lg:text-4xl">
		{heading}
	</h1>
	<p class="max-w-prose text-body-muted">
		{#if page.status === 404}
			That URL doesn&rsquo;t exist on this site. It may have moved, or the link may be old.
		{:else}
			The page failed to load. Trying again may work.
		{/if}
	</p>
	{#if page.error?.message && page.status !== 404}
		<p class="rounded-sm border border-line bg-surface p-3 font-mono text-xs text-body-faint">
			{page.error.message}
		</p>
	{/if}
	<p class="mt-2">
		<a
			href="/"
			class="inline-flex min-h-11 items-center rounded-sm bg-accent px-5 py-2.5 font-mono text-sm font-semibold text-canvas transition-colors hover:bg-accent-bright"
		>
			Back to home
		</a>
	</p>
</div>
