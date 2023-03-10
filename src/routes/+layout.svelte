<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { petStats, activeLocations } from '$lib/statStores.js';

    export const endpointHostname = ""
    // export const endpointHostname = "http://localhost:3000/"

    onMount(() => {
        function updateStats() {
            try {
                fetch(`${endpointHostname}petStats/`)
                    .then((response) => response.json())
                    .then((stats) => {
                        stats.forEach(stat => {
                            $petStats[stat.location][stat.statName] = stat ? stat.statValue : -1
                            $activeLocations[stat.location] = true
                            console.log("location", stat.location)
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
