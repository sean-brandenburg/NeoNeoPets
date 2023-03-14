<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { petStats, activeLocations, endpointHostname } from '$lib/statStores.js';

    onMount(() => {
        function updateStats() {
            try {
                fetch(`${endpointHostname}petStats/`)
                    .then((response) => response.json())
                    .then((stats) => {
                        console.log("STATS: " + stats)
                        stats.forEach(stat => {
                            $petStats[stat.location][stat.statName] = stat ? stat.statValue : -1
                            $activeLocations[stat.location] = true
                            // Trigger reactivity
                            $activeLocations = $activeLocations
                        });
                    })
            } catch (error) {
                console.log("could not connect to backend")
            }
        }

        const interval = setInterval(updateStats, 2000);
        updateStats()

        return () => clearInterval(interval)
    });
</script>

<div class="h-screen">
    <slot></slot>
</div>
