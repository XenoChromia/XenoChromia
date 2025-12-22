<script lang="ts">
	import type { PageData } from './$types';
	import Template1 from '$lib/templates/Template1.svelte';
	import Template2 from '$lib/templates/Template2.svelte';

	export let data: PageData;
</script>

{#if data.postTemplateType === 1}
	<Template1 id={Number(data.id)} />
{:else if data.postTemplateType == 2}
	<Template2 id={Number(data.id)} />
{/if}
