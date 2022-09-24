import App from './App.svelte';

const target = document.querySelector("#svelte-app")

export const app = new App({
	target: target,
	props: {}
});

export default app