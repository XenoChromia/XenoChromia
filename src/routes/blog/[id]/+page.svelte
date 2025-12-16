<script lang="ts">
    import type { PageData } from './$types';
    import Template1 from '$lib/templates/Template1.svelte';

    export let data: PageData;
</script>

{#if data.postTemplateType === 1}
    <Template1 id={data.id} />
{/if}

