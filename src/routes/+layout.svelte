<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();

	/**
	 * Default document title, set here rather than as a static tag in
	 * app.html.
	 *
	 * A static `<title>` in app.html is outside SvelteKit's head-merge, so it
	 * was emitted IN ADDITION to each page's own `<title>` — the homepage
	 * shipped two, and because browsers honour the first, the page-specific
	 * title was silently discarded. Pages that don't set one (the error page)
	 * now still get a sensible title instead of the raw default.
	 */
	const defaultTitle = 'Wai Meng Leong — Information Technology student';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{defaultTitle}</title>
</svelte:head>

{@render children?.()}
