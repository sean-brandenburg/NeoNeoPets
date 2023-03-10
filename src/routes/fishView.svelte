<script>
    import { onMount } from 'svelte';
    import NormalWhite from './NormalWhite.svelte';
    import HungryWhite from './HungryWhite.svelte';
    import HappyWhite from './HappyWhite.svelte';
    import FaintedWhite from './FaintedWhite.svelte';
    import BoredWhite from './BoredWhite.svelte';
    import NormalDark from './NormalDark.svelte';
    import HungryDark from './HungryDark.svelte';
    import HappyDark from './HappyDark.svelte';
    import FaintedDark from './FaintedDark.svelte';
    import BoredDark from './BoredDark.svelte';
    import { petStats } from '$lib/statStores.js';
    import endpointHostname from './+layout.svelte'
    
    export let location;
    export let renderDivider;

    var fishWidth = 631;
    var fishHeight = 309;
    var scale = 0.6;
    var scaledFishWidth = fishWidth * scale;
    var scaledFishHeight = fishHeight * scale;

    var flipFish = true;

    var statsPosition;
    var borderStyle = "";
    if (location == "atx" && renderDivider){
        statsPosition = " bottom-4";
        borderStyle = " border-solid border-t-2 border-white"
    } else {
        statsPosition = " top-4";
    }

    var skewX = -10;
    var dSkewX = 1;

    var currX = 0;
    var currY = 0;
    
    // Velocity based random walk
    var vx = 1;
    var vy = 0;
    var ax = 0;
    var ay = 0;

    var fishId = "fish_" + (Math.random() + 1).toString(36).substring(7);
    var finId = "fin_" + (Math.random() + 1).toString(36).substring(7);

    var happy = $petStats[location].happiness > 80;

    $: userActions = []
    let lastUserActionQueryTime = new Date(Date.now()).toISOString().replace(/.\d+Z$/g, "");

    function moveSection(idStr, xOffset, yOffset, invert) {
        var domElemnt = document.getElementById(idStr);

        // var x = xOffset - fishWidth * (1 - scale) / 2 + xOffset
        // var y = yOffset - fishHeight * (1 - scale) / 2 + yOffset
        var x = xOffset - (fishWidth * (1-scale))/2;
        var y = yOffset - (fishHeight * (1-scale))/2;

        var transformAttr = ' translate(' + x + ',' + y + ')';
        if (invert) {
            transformAttr += ` scale(${-1 * scale},${scale})`;
        } else {
            transformAttr += ` scale(${scale},${scale})`;
        }
        if (domElemnt) {
            domElemnt.setAttribute('transform', transformAttr);
        }
    }

    function moveFin(rotate) {
        var domElement = document.getElementById(finId);
        if (domElement && happy) {
            domElement.setAttribute('transform', `rotate(${rotate}, 230, 174)`);
        } else if (domElement) {
            domElement.setAttribute('transform', `rotate(${rotate}, 200, 150)`);
        } 
    }

    onMount(() => {
        window.setInterval(() => {
            var width = document.getElementById("fish-view").offsetWidth;
            var height = document.getElementById("fish-view").offsetHeight;

            // Update position
            currX = currX + vx * 1.5;
            currY = currY + vy * 1.5;
            // vx += (Math.random()) * 0.01 * (flipFish ? 1 : -1);
            // vy += (Math.random() - 0.5) * 0.1;

            ax = Math.random() - 0.5;
            ay = Math.random() - 0.5;

            var newVx = vx + ax;
            if (Math.abs(newVx - vx) < 0.1) {
                vx = newVx;
            }
            var newVy = vy + ay;
            if (Math.abs(newVy - vy) < 0.1) {
                vy = newVy;
            }

            //console.log(currX, width - scaledFishWidth, width);
            if (currX > width - scaledFishWidth) {
                vx = -0.5;
                ax = 0;
            } else if (currX < 0) {
                vx = 0.5
                ax = 0;
            }
            if (currY > height - scaledFishHeight) {
                vy = -0.5;
                ay = 0;
            } else if (currY < 0) {
                vy = 0.5;
                ay = 0;
            }

            flipFish = vx >= 0 ? true : false;

            // Update Skew
            skewX += dSkewX * (Math.abs(vx) + Math.abs(vy))/2;
            if (skewX > 10) {
                dSkewX = -1;
            } else if (skewX < -10) {
                dSkewX = 1;
            }
            
            // Perform movements
            moveSection(fishId, currX, currY, flipFish);
            moveFin(skewX);
        }, 1000 / 60);

        function updateUserActions() {
            try {
                fetch(`${endpointHostname}getNewUserActions/${lastUserActionQueryTime}`)
                    .then((response) => response.json())
                    .then((actions) => {
                        userActions = [...userActions, ...actions];
                    })
            } catch (error) {
                console.log("could not connect to backend")
            }
            lastUserActionQueryTime = new Date(Date.now()).toISOString().replace(/.\d+Z$/g, "");
            // Prune entries older than 10000 ms
            userActions = userActions.filter(item => 
                new Date(item.lastAction).getMilliseconds() < (new Date(Date.now()).getMilliseconds() - 10000)
            );
        }   
        const interval = setInterval(updateUserActions, 5000);
        updateUserActions()
        return () => clearInterval(interval)
    });
</script>

<div class={"w-full h-full" + borderStyle}>
    <div class="h-full w-full overflow-hidden relative" id="fish-view">
        <div class= {"flex flex-col absolute left-0 right-0 " + statsPosition}>
            <div class="stats shadow align-bottom items-center mx-auto">
                <div class="stat">
                <div class="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <div class="stat-title">Hunger</div>
        
                <div class="stat-value text-primary"> {($petStats[location].hunger == -1) ? '...' : `${$petStats[location].hunger}/ 100`}</div>
                </div>
        
                <div class="stat">
                <div class="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div class="stat-title text-lg">Thirst</div>
                <div class="stat-value text-secondary"> {($petStats[location].thirst == -1) ? '...' : `${$petStats[location].thirst}/ 100`}</div>
                </div>
        
                <div class="stat">
                    <div class="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div class="stat-title">Cleanliness</div>
                    <div class="stat-value text-primary"> {($petStats[location].cleanliness == -1) ? '...' : `${$petStats[location].cleanliness}/ 100`}</div>
                </div>
                
                <div class="stat">
                    <div class="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div class="stat-title">Happiness</div>
                    <div class="stat-value text-secondary"> {($petStats[location].happiness == -1) ? '...' : `${$petStats[location].happiness}/ 100`}</div>
                </div>
            </div>
        </div>

        {#if location == "nyc"} 
            {#if $petStats[location].hunger == 0 || $petStats[location].happiness == 0 || $petStats[location].cleanliness == 0 || $petStats[location].thirst == 0}
                <FaintedWhite fishId={fishId} finId={finId} />
            {:else if $petStats[location].hunger < 50  || $petStats[location].thirst < 50}
                <HungryWhite fishId={fishId} finId={finId} />
            {:else if $petStats[location].happiness > 80}
                <HappyWhite fishId={fishId} finId={finId} />
            {:else if $petStats[location].happiness < 50}
                <BoredWhite fishId={fishId} finId={finId} />
            {:else}
                <NormalWhite fishId={fishId} finId={finId}/>
            {/if}
        {/if}

        {#if location == "atx"} 
            {#if $petStats[location].hunger == 0 || $petStats[location].happiness == 0 || $petStats[location].cleanliness == 0 || $petStats[location].thirst == 0}
                <FaintedDark fishId={fishId} finId={finId} />
            {:else if $petStats[location].hunger < 50  || $petStats[location].thirst < 50}
                <HungryDark fishId={fishId} finId={finId} />
            {:else if $petStats[location].happiness > 80}
                <HappyDark fishId={fishId} finId={finId} />
            {:else if $petStats[location].happiness < 50}
                <BoredDark fishId={fishId} finId={finId} />
            {:else}
                <NormalDark fishId={fishId} finId={finId}/>
            {/if}
        {/if}
    </div>
</div>