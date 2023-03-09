<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { petStats } from '$lib/statStores.js';

    onMount(() => {
        function updateStats() {
            console.log("HERE")
            try {
                fetch('http://localhost:3000/petStats/')
                    .then((response) => response.json())
                    .then((stats) => {
                        stats.forEach(stat => {
                            $petStats[stat.location][stat.statName] = stat ? stat.statValue : -1
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

<div class= "flex flex-col pt-4 h-screen">
    <div class="stats shadow align-bottom items-center mx-64">

        <div class="stat">
        <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </div>
        <div class="stat-title">Hunger</div>

        <div class="stat-value text-primary"> {($petStats.atx.hunger == -1) ? '...' : `${$petStats.atx.hunger}/ 100`}</div>
        </div>

        <div class="stat">
        <div class="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div class="stat-title">Thirst</div>
        <div class="stat-value text-secondary"> {($petStats.atx.thirst == -1) ? '...' : `${$petStats.atx.thirst}/ 100`}</div>
        </div>

        <div class="stat">
            <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <div class="stat-title">Cleanliness</div>
            <div class="stat-value text-primary"> {($petStats.atx.cleanliness == -1) ? '...' : `${$petStats.atx.cleanliness}/ 100`}</div>
        </div>
        
        <div class="stat">
            <div class="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div class="stat-title">Happiness</div>
            <div class="stat-value text-secondary"> {($petStats.atx.happiness == -1) ? '...' : `${$petStats.atx.happiness}/ 100`}</div>
        </div>

    </div>

    <slot></slot>
</div>
