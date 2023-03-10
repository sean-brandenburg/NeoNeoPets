<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { petStats, activeLocations } from '$lib/statStores.js';

    onMount(() => {
        function updateStats() {
            console.log("HERE")
            try {
                fetch('http://localhost:3000/petStats/')
                    .then((response) => response.json())
                    .then((stats) => {
                        stats.forEach(stat => {
                            $petStats[stat.location][stat.statName] = stat ? stat.statValue : -1
                            $activeLocations[stat.location] = true
                            console.log("location", stat.location)
                        });
                        console.log($petStats)
                    })
            } catch (error) {
                console.log("could not connect to backend")
            }
        }

        const interval = setInterval(updateStats, 5000);
        updateStats()

        return () => clearInterval(interval)
    });
</script>

<div class="h-screen">
    <slot></slot>
</div>
