import {
	Request, Response, Router 
} from 'express';
import {
	storeMultipleKcalInput,
	storeWeightInput,
	storeUserConfiguration,
	loadUserConfiguration,
	createUserJson,
	updateUserJson,
	deleteKcal,
	updateKcal,
	handleGetAllKcalData,
	handleGetAllWeightData,
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

const postWeight = async (req: Request, res: Response) => {
	try {
		await storeWeightInput(req.body, req.query.user as string);
		res.redirect('/input_weight');
	} catch (e: unknown) {
		res.status(500);
		let message = 'Could not store weight.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		console.error(message);
		res.json({
			message
		});
	}
};

const getAllKcalData = async (req: Request, res: Response) => {
	try {
		res.json(await handleGetAllKcalData({
			user: req.query.user as string,
			range: req.query.for as string,
			select: req.query.by as string,
			page: req.query.page as string,
			order: req.query.order as string
		}));
	} catch (e: unknown) {
		res.status(500);
		let message = 'Could not get all kcal data.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		console.error(message);
		res.json({
			message
		});
	}
};

const getAllWeightData = async (req: Request, res: Response) => {
	try {
		res.json(await handleGetAllWeightData({
			user: req.query.user as string,
			summary: req.query.summary as string,
		}));
	} catch (e: unknown) {
		res.status(500);
		let message = 'Could not get all weight data.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		console.error(message);
		res.json({
			message
		});
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
	try {
		await deleteKcal(req.query.user as string, req.query.id as string);
		res.status(200);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		let message = 'Could not delete kcal.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		console.error(message);
		res.status(500);
		res.json({
			message
		});
	}
};

const updateKcalHandler = async (req: Request, res: Response) => {
	try {
		await updateKcal(req.body, req.query.user as string);

		res.status(200);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		let message = 'Could not update kcal.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		console.error(message);
		res.status(500);
		res.json({
			message
		});
	}
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