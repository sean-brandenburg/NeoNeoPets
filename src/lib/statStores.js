import { writable } from 'svelte/store';

export const hunger = writable(-1);
export const thirst = writable(-1);
export const cleanliness = writable(-1);
export const happiness = writable(-1);

console.log("statStore")