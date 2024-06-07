import { Request, Response, Router } from "express";
import {
    storeMultipleKcalInput,
    loadAllKcal,
    loadTodayKcalSummary,
    storeWeightInput,
    loadAllWeight,
    loadUniqueKcalInput
} from "./controller";

const staticPath = __dirname + "/public";
const sendHtml = (req: Request, res: Response) => res.sendFile(`${staticPath}${req.url}.html`);

const postKcal = (req: Request, res: Response) => {
    storeMultipleKcalInput(req.body)
    res.redirect('/input_kcal');
}

const postWeight = (req: Request, res: Response) => {
    storeWeightInput(req.body)
    res.redirect('/input_weight');
}

const getAllKcalData = async (req: Request, res: Response) => {
    if (req.query.for === "today") {
        res.json(await loadTodayKcalSummary());
    } else if (req.query.by === "what") {
        res.json(await loadUniqueKcalInput());
    } else {
        res.json(await loadAllKcal());
    }
}

const getAllWeightData = async (_req: Request, res: Response) => res.json(await loadAllWeight());

const router = Router();

router.post('/api/input_kcal', postKcal);
router.get('/input_kcal', sendHtml)
router.post('/api/input_weight', postWeight);
router.get('/input_weight', sendHtml)
router.get('/api/kcal', getAllKcalData);
router.get('/summary_kcal', sendHtml)
router.get('/api/weight', getAllWeightData);
router.get('/summary_weight', sendHtml)

export { router };