<script>
    import FishView from './fishView.svelte';
    import { petStats, activeLocations } from '$lib/statStores.js';
    import { onMount } from "svelte";
    import endpointHostname from './+layout.svelte'

    const actionMap = {
        "hunger": "fed",
        "thirst": "given water to",
        "happiness": "played with",
        "cleanliness": "cleaned",
    }

    const notificationLingerTimeMs = 30000

    function getDateTimeISOString(additionalOffset) {
        // const offset = new Date().getTimezoneOffset();
        // const myDate = Date.now() - (offset * 60 * 1000) - additionalOffset;
        // const dateAsISO = new Date(myDate).toISOString();
        const dateAsISO = new Date(Date.now() - additionalOffset).toISOString();
        return dateAsISO.replace(/.\d+Z$/g, "")
    }


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
    $: MTSSonline = true
    let lastUserActionQueryTime = getDateTimeISOString(0)

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
                fetch(`${endpointHostname}getNewUserActions/${lastUserActionQueryTime}`)
                    .then((response) => response.json())
                    .then((actions) => {
                        userActions = actions
                    })
                fetch(`${endpointHostname}onlineStatus/`)
                    .then((response) => {
                        if (response.status == 200){
                            return response.json()
                        }
                        return null
                    })
                    .then((status) => {
                        if (status){
                            MTSSonline = status.online
                        }
                    })
            } catch (error) {
                console.log("could not connect to backend")
            }

            // Get all entries less than 10 seconds old
            lastUserActionQueryTime = getDateTimeISOString(notificationLingerTimeMs)
        }   
        const interval = setInterval(updateUserActions, 2000);
        updateUserActions()
        return () => clearInterval(interval)
    });
</script>

<div class="flex flex-col h-full">
    {#if 'nyc' in $activeLocations}
        <FishView location="nyc" renderDivider={false}></FishView>
    {/if}
    {#if 'atx' in $activeLocations}
        <FishView location="atx" renderDivider={'nyc' in $activeLocations}></FishView>
    {/if}

    <div class="absolute bottom-5 left-5 w-full text-4xl">
        {#each userActions as { _id, actionTaken, petName }}
            <div class="chat chat-start">
                <div class="chat-bubble">{_id} has {actionMap[actionTaken]} {petName}!</div>
            </div>
        {/each}
    </div>
    
    {#if !MTSSonline}
    <div class="absolute bottom-5 right-5 w-64">
        <div class="alert alert-warning">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Disconnected From Cloud!</span>
            </div>
        </div>
    </div>
    {/if}
</div>
