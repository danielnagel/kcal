const cache_name = 'kcal-cache';
const urls_to_cache = [
	'/404',
	'/chart.umd.js',
	'/chart.umd.js.map',
	'/configuration',
	'/configuration.js',
	'/favicon.ico',
	'/index.css',
	'/',
	'/index.js',
	'/input_kcal',
	'/input_kcal.js',
	'/input_weight',
	'/input_weight.js',
	'/login',
	'/login.js',
	'/summary_kcal',
	'/summary_kcal.js',
	'/summary_weight',
	'/summary_weight.js',
	'/user_configuration',
	'/user_configuration.js',
	'/utils.js',
];

self.addEventListener('activate', e => {
	e.waitUntil(
	  caches.keys().then(cacheNames => {
			return Promise.all(
		  cacheNames.map(cacheName => caches.delete(cacheName))
			);
	  })
	);
});

self.addEventListener('install', (e) => {
	e.waitUntil(caches.open(cache_name).then((cache) => {
		return cache.addAll(urls_to_cache);
	}));
});
