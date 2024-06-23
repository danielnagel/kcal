import { Request, Response, Router } from "express";
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
} from "./controller"

const staticPath = __dirname + "/public";
const sendHtml = (req: Request, res: Response) => res.sendFile(`${staticPath}${req.url}.html`);

const postKcal = (req: Request, res: Response) => {
	if(typeof req.query.user !== "string") {
		console.error(`Cannot postKcal, add user to query.`);
		return;
	}
	storeMultipleKcalInput(req.body, req.query.user)
	res.redirect('/input_kcal');
}

const postWeight = (req: Request, res: Response) => {
	if(typeof req.query.user !== "string") {
		console.error(`Cannot postWeight, add user to query.`);
		return;
	}
	storeWeightInput(req.body, req.query.user)
	res.redirect('/input_weight');
}

const getAllKcalData = async (req: Request, res: Response) => {
	if(typeof req.query.user !== "string") {
		console.error(`Cannot getAllKcalData, add user to query.`);
		return;
	}
	if (req.query.for === "today") {
		res.json(await loadTodayKcalSummary(req.query.user));
	} else if (req.query.by === "what") {
		res.json(await loadUniqueKcalInput(req.query.user));
	} else {
		res.json(await loadAllKcal(req.query.user));
	}
}

const getAllWeightData = async (req: Request, res: Response) => {
	if(typeof req.query.user !== "string") {
		console.error(`Cannot getAllWeightData, add user to query.`);
		return;
	}
	if (req.query.summary === "true") {
		res.json(await loadWeightTarget(req.query.user));
	} else {
		res.json(await loadAllWeight(req.query.user));
	}
}

const getConfiguration = async (req: Request, res: Response) => {
	if(typeof req.query.user !== "string") {
		console.error(`Cannot getConfiguration, add user to query.`);
		return;
	}
	res.json(await loadUserConfiguration(req.query.user));
}

const postConfiguration = (req: Request, res: Response) => {
	if(typeof req.query.user !== "string") {
		console.error(`Cannot postConfiguration, add user to query.`);
		return;
	}
	storeUserConfiguration(req.body, req.query.user)
	res.redirect('/configuration');
}

const router = Router();

router.post('/api/input_kcal', postKcal);
router.get('/input_kcal', sendHtml)
router.post('/api/input_weight', postWeight);
router.get('/input_weight', sendHtml)
router.get('/api/kcal', getAllKcalData);
router.get('/summary_kcal', sendHtml)
router.get('/api/weight', getAllWeightData);
router.get('/summary_weight', sendHtml)
router.get('/configuration', sendHtml);
router.get('/api/configuration', getConfiguration);
router.post('/api/configuration', postConfiguration);

export { router };