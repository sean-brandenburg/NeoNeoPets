<script>
    import { onMount } from 'svelte';
    import Normal from './NormalWhite.svelte';
    import Hungry from './HungryWhite.svelte';
    import Happy from './HappyWhite.svelte';
    import Fainted from './FaintedWhite.svelte';
    import Bored from './BoredWhite.svelte';
    import { petStats } from '$lib/statStores.js';

    var fishWidth = 631;
    var fishHeight = 309;
    var scale = 0.6;
    var scaledFishWidth = fishWidth * scale;
    var scaledFishHeight = fishHeight * scale;

    var flipFish = true;

    var skewX = -10;
    var dSkewX = 1;

    var currX = 0;
    var currY = 0;
    
    // Velocity based random walk
    var vx = 1;
    var vy = 0;
    var ax = 0;
    var ay = 0;

    // TODO: figure out how to get these from the other component:


    var happy = $petStats.atx.happiness > 80;

    $: userActions = []
    let lastUserActionQueryTime = new Date(Date.now()).toISOString().replace(/.\d+Z$/g, "");

    function moveSection(idStr, xOffset, yOffset, invert) {
        var domElemnt = document.getElementById(idStr);

        // var x = xOffset - fishWidth * (1 - scale) / 2 + xOffset
        // var y = yOffset - fishHeight * (1 - scale) / 2 + yOffset
        var x = xOffset - (fishWidth * (1-scale))/2;
        var y = yOffset - (fishHeight * (1-scale));

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
        var domElement = document.getElementById("fin");
        if (domElement && happy) {
            domElement.setAttribute('transform', `rotate(${rotate}, 230, 174)`);
        } else if (domElement) {
            domElement.setAttribute('transform', `rotate(${rotate}, 200, 150)`);
        } 
    }

    onMount(() => {
        window.setInterval(() => {
            var width = window.innerWidth;
            var height = window.innerHeight;

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
            if (skewX > 10 || skewX < -10) {
                dSkewX = -1 * dSkewX;
            } 
            
            // Perform movements
            moveSection("fish", currX, currY, flipFish);
            moveFin(skewX);
        }, 1000 / 60);

        function updateUserActions() {
            try {
                fetch(`http://127.0.0.1:3000/getNewUserActions/${lastUserActionQueryTime}`)
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

<div class="">
    {#if $petStats.atx.hunger == 0 || $petStats.atx.happiness == 0 || $petStats.atx.cleanliness == 0 || $petStats.atx.thirst == 0}
        <Fainted />
    {:else if $petStats.atx.hunger < 50  || $petStats.atx.thirst < 50}
        <Hungry />
    {:else if $petStats.atx.happiness > 80}
        <Happy />
    {:else if $petStats.atx.happiness < 50}
        <Bored />
    {:else}
        <Normal />
    {/if}
</div>