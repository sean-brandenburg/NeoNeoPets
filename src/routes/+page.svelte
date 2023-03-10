<script>
    import FishView from './fishView.svelte';
    import { activeLocations } from '$lib/statStores.js';

</script>

<div class="flex flex-col h-full">
    {#if 'nyc' in $activeLocations}
        <FishView location="nyc" renderDivider={false}></FishView>
    {/if}
    {#if 'atx' in $activeLocations}
        <FishView location="atx" renderDivider={'nyc' in $activeLocations}></FishView>
    {/if}

</div>