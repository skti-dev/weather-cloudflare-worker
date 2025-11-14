/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		if (url.pathname === '/weather') {
			if (!env.WEATHER_KV) {
				return new Response('Weather KV not configured', { status: 503 });
			}
			const value = await env.WEATHER_KV.get('latest');
			if (!value) return new Response('No data', { status: 404 });
			return new Response(value, { headers: { 'Content-Type': 'application/json' } });
		}
		return new Response('Hello World!');
	},

	async scheduled(controller, env, ctx) {
		const BASE_URL = env.WEATHER_BASE_URL;
		const API_KEY = env.WEATHER_API_KEY;

		if(!BASE_URL || !API_KEY) {
			console.error('Missing environment variables for weather API');
			return;
		}

		try {
			const response = await fetch(`${BASE_URL}/current.json?q=Sao_Paulo&key=${API_KEY}`);
			const data = await response.json();
			console.log('Weather data for Sao Paulo:', data);
			if (env.WEATHER_KV && env.WEATHER_KV.put) {
				await env.WEATHER_KV.put('latest', JSON.stringify({ fetchedAt: Date.now(), data }));
			} else {
				console.warn('WEATHER_KV binding not found; skipping persist');
			}
		} 	catch (err) {
			console.error('Error in scheduled worker:', err);
		}
	}
};
