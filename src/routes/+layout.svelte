<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { hunger, thirst, cleanliness, happiness } from '$lib/statStores.js';

    // onMount(() => {
    //     function updateStats() {
    //         try {
    //             fetch('http://127.0.0.1:3000/petStats/mr.fish')
    //                 .then((response) => response.json())
    //                 .then((stats) => {
    //                     const hungerObj = stats.find(stat => stat.statName == "hunger")
    //                     $hunger = hungerObj ? hungerObj.statValue : -1

    //                     const thirstObj = stats.find(stat => stat.statName == "thirst")
    //                     $thirst = thirstObj ? thirstObj.statValue : -1

    //                     const cleanlinessObj = stats.find(stat => stat.statName == "cleanliness")
    //                     $cleanliness = cleanlinessObj ? cleanlinessObj.statValue : -1

    //                     const happinessObj= stats.find(stat => stat.statName == "happiness")
    //                     $happiness = happinessObj ? happinessObj.statValue : -1
    //                     // $happiness = stats.name;
    //                 })
    //         } catch (error) {
    //             console.log("could not connect to backend")
    //         }
    //     }   

    //     const interval = setInterval(updateStats, 5000);
    //     updateStats()

    //     return () => clearInterval(interval)
    // });

</script>

<div class= "flex flex-col pt-4 h-screen">
    <div class="stats shadow align-bottom items-center mx-64">

        <div class="stat">
        <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </div>
        <div class="stat-title">Hunger</div>
        <!-- <div class="radial-progress" style="--value:0;">0%</div> -->

        <div class="stat-value text-primary"> {($hunger == -1) ? '...' : `${$hunger}/ 100`}</div>
        </div>

        <div class="stat">
        <div class="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div class="stat-title">Thirst</div>
        <div class="stat-value text-secondary"> {($thirst == -1) ? '...' : `${$thirst}/ 100`}</div>
        </div>

        <div class="stat">
            <div class="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>
            <div class="stat-title">Cleanliness</div>
            <div class="stat-value text-primary"> {($cleanliness == -1) ? '...' : `${$cleanliness}/ 100`}</div>
        </div>
        
        <div class="stat">
            <div class="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div class="stat-title">Happiness</div>
            <div class="stat-value text-secondary"> {($happiness == -1) ? '...' : `${$happiness}/ 100`}</div>
        </div>

    </div>

    <slot></slot>
</div>
