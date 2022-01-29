import App from './App.svelte';

const target = document.querySelector("#svelte-app")

const app = new App({
	target: target,
	props: { }
});

export default app;