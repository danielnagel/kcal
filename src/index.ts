import express from 'express';
import bodyParser from 'body-parser';
import {
	router 
} from './routes';

(async () => {
	const port = 8080;
	const staticPath = __dirname + '/public';

	const app = express();

	app.use(express.static(staticPath));
	app.use(bodyParser.urlencoded({
		extended: false 
	}));
	app.use(bodyParser.json());
	app.use('/', router);

	app.use((_req, res) => {
		res.sendFile(`${staticPath}/404.html`);
	});


	app.listen(port, () => {
		console.log(`listening on port ${port} ...`);
	});
})();