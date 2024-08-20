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

const handleError = async (res: Response, errMessage: string, error: unknown) => {
	res.status(500);
	let message = errMessage;
	if (error instanceof Error) message += ` Reason: ${error.message}`;
	console.error(message);
	res.json({
		message
	});
};

const postKcal = async (req: Request, res: Response) => {
	try {
		await storeMultipleKcalInput(req.body, req.query.user as string);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		handleError(res, 'Could not store kcal.', e);
	}
};

const postWeight = async (req: Request, res: Response) => {
	try {
		await storeWeightInput(req.body, req.query.user as string);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		handleError(res, 'Could not store weight.', e);
	}
};

const getAllKcalData = async (req: Request, res: Response) => {
	try {
		res.json(await handleGetAllKcalData({
			user: req.query.user as string,
			range: req.query.range as string,
			select: req.query.select as string,
			page: req.query.page as string,
			order: req.query.order as string,
			group: req.query.group as string
		}));
	} catch (e: unknown) {
		handleError(res, 'Could not get all kcal data.', e);
	}
};

const getAllWeightData = async (req: Request, res: Response) => {
	try {
		res.json(await handleGetAllWeightData({
			user: req.query.user as string,
			summary: req.query.summary as string,
		}));
	} catch (e: unknown) {
		handleError(res, 'Could not get all weight data.', e);
	}
};

const getConfiguration = async (req: Request, res: Response) => {
	try {
		res.json(await loadUserConfiguration(req.query.user as string));
	} catch (e: unknown) {
		handleError(res, 'Could not get configuration.', e);
	}
};

const postConfiguration = async (req: Request, res: Response) => {
	try {
		await storeUserConfiguration(req.body, req.query.user as string);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		handleError(res, 'Could not store configuration.', e);
	}
};

const postNewUserJson = async (req: Request, res: Response) => {
	try {
		await createUserJson(req.body.user);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		handleError(res, 'Could not create new user json.', e);
	}
};

const postUpdateUserJson = async (req: Request, res: Response) => {
	try {
		await updateUserJson(req.body.user, req.body.newUser);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		handleError(res, 'Could not update user json.', e);
	}
};

const deleteKcalHandler = async (req: Request, res: Response) => {
	try {
		await deleteKcal(req.query.user as string, req.query.id as string);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		handleError(res, 'Could not delete kcal.', e);
	}
};

const updateKcalHandler = async (req: Request, res: Response) => {
	try {
		await updateKcal(req.body, req.query.user as string);
		res.json({
			message: 'ok'
		});
	} catch (e: unknown) {
		handleError(res, 'Could not update kcal.', e);
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