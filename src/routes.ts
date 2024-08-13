import {
	Request, Response, Router 
} from 'express';
import {
	storeMultipleKcalInput,
	loadAllKcal,
	loadTodayKcalSummary,
	storeWeightInput,
	loadAllWeight,
	loadUniqueKcalInput,
	loadWeightTarget,
	storeUserConfiguration,
	loadUserConfiguration,
	createUserJson,
	updateUserJson,
	deleteKcal,
	updateKcal,
} from './controller';

const staticPath = __dirname + '/public';
const sendHtml = (req: Request, res: Response) => res.sendFile(`${staticPath}${req.url}.html`);

const postKcal = async (req: Request, res: Response) => {
	try {
		await storeMultipleKcalInput(req.body, req.query.user as string);
		res.redirect('/input_kcal');
	} catch (e: unknown) {
		res.status(500);
		let message = 'Could not store kcal.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		console.error(message);
		res.json({
			message
		});
	}
};

const postWeight = (req: Request, res: Response) => {
	if (typeof req.query.user !== 'string') {
		console.error('Cannot postWeight, add user to query.');
		res.status(422);
		return;
	}
	storeWeightInput(req.body, req.query.user);
	res.redirect('/input_weight');
};

const getAllKcalData = async (req: Request, res: Response) => {
	if (typeof req.query.user !== 'string') {
		console.error('Cannot getAllKcalData, add user to query.');
		res.status(422);
		return;
	}
	if (req.query.for === 'today') {
		res.json(await loadTodayKcalSummary(req.query.user));
	} else if (req.query.by === 'what') {
		res.json(await loadUniqueKcalInput(req.query.user));
	} else {
		let page = 0;
		if (typeof req.query.page !== 'undefined') {
			try {
				page = parseInt(req.query.page as string);
			} catch (e) {
				if (e instanceof Error)
					console.error(`Page ${req.query.page} is not a number. ${e.message}`);
			}
		}
		res.json(await loadAllKcal(req.query.user, req.query.order as string, page));
	}
};

const getAllWeightData = async (req: Request, res: Response) => {
	if (typeof req.query.user !== 'string') {
		console.error('Cannot getAllWeightData, add user to query.');
		res.status(422);
		return;
	}
	if (req.query.summary === 'true') {
		res.json(await loadWeightTarget(req.query.user));
	} else {
		res.json(await loadAllWeight(req.query.user));
	}
};

const getConfiguration = async (req: Request, res: Response) => {
	if (typeof req.query.user !== 'string') {
		console.error('Cannot getConfiguration, add user to query.');
		res.status(422);
		return;
	}
	res.json(await loadUserConfiguration(req.query.user));
};

const postConfiguration = async (req: Request, res: Response) => {
	if (typeof req.query.user !== 'string') {
		console.error('Cannot postConfiguration, add user to query.');
		res.status(422);
		return;
	}
	await storeUserConfiguration(req.body, req.query.user);
	res.redirect('/configuration');
};

const postNewUserJson = async (req: Request, res: Response) => {
	try {
		await createUserJson(req.body.user);
		res.redirect('/user_configuration');
	} catch (e: unknown) {
		res.status(500);
		let message = 'Could not create new user json.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		console.error(message);
		res.json({
			message
		});
	}
};

const postUpdateUserJson = async (req: Request, res: Response) => {
	await updateUserJson(req.body.user, req.body.newUser);
	res.redirect('/user_configuration');
};

const deleteKcalHandler = async (req: Request, res: Response) => {
	if (typeof req.query.user !== 'string') {
		console.error('Cannot delete kcal, add user to query.');
		res.status(422);
		return;
	}
	if (typeof req.query.id !== 'string') {
		console.error('Cannot delete kcal, add id to query.');
		res.status(422);
		return;
	}
	try {
		await deleteKcal(req.query.user, req.query.id);
		res.status(200);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		let message = 'An error occured while deleting kcal.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		console.error(message);
		res.status(422);
		res.json({
			message
		});
	}
};

const updateKcalHandler = async (req: Request, res: Response) => {
	if (typeof req.query.user !== 'string') {
		const message = 'Cannot update kcal, add user to query.';
		console.error(message);
		res.status(422);
		res.json({
			message
		});
		return;
	}

	await updateKcal(req.body, req.query.user);
	res.status(200);
	res.json({
		message: 'ok'
	});
};


const router = Router();

router.post('/api/input_kcal', postKcal);
router.get('/input_kcal', sendHtml);
router.post('/api/input_weight', postWeight);
router.get('/input_weight', sendHtml);
router.get('/api/kcal', getAllKcalData);
router.delete('/api/kcal', deleteKcalHandler);
router.put('/api/kcal', updateKcalHandler);
router.get('/summary_kcal', sendHtml);
router.get('/api/weight', getAllWeightData);
router.get('/summary_weight', sendHtml);
router.get('/configuration', sendHtml);
router.get('/api/configuration', getConfiguration);
router.post('/api/configuration', postConfiguration);
router.get('/user_configuration', sendHtml);
router.post('/api/user/new', postNewUserJson);
router.post('/api/user/update', postUpdateUserJson);

export {
	router 
};