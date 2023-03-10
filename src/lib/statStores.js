import { writable } from 'svelte/store';

export const petStats= writable({
    "nyc": {
        "hunger": -1,
        "thirst": -1,
        "cleanliness": -1,
        "happiness": -1,
        "online": 100,
    },
    "atx": {
        "hunger": -1,
        "thirst": -1,
        "cleanliness": -1,
        "happiness": -1,
        "online": 100,
    },
});

export const activeLocations = writable({});

export const endpointHostname = ""
// export const endpointHostname = "http://localhost:3000/"