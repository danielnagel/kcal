const cache_name = 'kcal-cache';
const urls_to_cache = [
	'/',
	'/input_kcal',
	'/input_weight',
	'/summary_kcal',
	'/summary_weight',
	'/index.js',
	'/utils.js',
	'/input_kcal.js',
	'/input_weight.js',
	'/summary_kcal.js',
	'/summary_weight.js',
	'/chart.umd.js',
	'/tabulator.min.js',
	'/index.css',
	'/tabulator.min.css',
	'/favicon.ico',
];

self.addEventListener('install', (e) => {
	e.waitUntil(caches.open(cache_name).then((cache) => {
		return cache.addAll(urls_to_cache);
	}));
});

const putInCache = async (request, response) => {
	if (response.type === "error" || response.type === "opaque") {
		return Promise.resolve(); // do not put in cache network errors
	}

	const cache = await caches.open(cache_name);
	await cache.put(request, response.clone());
};

const update = async (request) => {
	const response = await fetch(request.url);
	await putInCache(request, response);
	return Promise.resolve(response);
};

const refresh = async (response) => {
	const jsonResponse = await response.json();
	self.clients.matchAll().then(clients => {
		clients.forEach(client => {
			client.postMessage(
				JSON.stringify({
					type: response.url,
					data: jsonResponse
				})
			);
		});
	});
	return jsonResponse;
};

const respondCacheOrFetch = (e) => {
	e.respondWith(
		caches.match(e.request)
			.then((cached) => {
				// cache first strategy
				return cached || fetch(e.request);
			})
	);
};

self.addEventListener('fetch', (e) => {
	if (e.request.url.includes("/api/")) {
		// response to API requests, Cache Update Refresh strategy
		respondCacheOrFetch(e);
		// https://pwa-workshop.js.org/4-api-cache/#implementation
		e.waitUntil(update(e.request).then(refresh));
	} else {
		// static files
		respondCacheOrFetch(e);
	}
});