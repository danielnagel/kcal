import { Request, Response, Router } from "express";
import {
    storeKcalInput,
    loadAllKcal,
    loadTodayKcalSummary,
    storeWeightInput,
    loadAllWeight
} from "./controller";

const staticPath = __dirname + "/public";
const sendHtml = (req: Request, res: Response) => res.sendFile(`${staticPath}${req.url}.html`);



const postKcal = (req: Request, res: Response) => {
    storeKcalInput(req.body)
    res.redirect('/input_kcal');
}
const postWeight = (req: Request, res: Response) => {
    storeWeightInput(req.body)
    res.redirect('/input_weight');
}
const getAllKcalData = async (req: Request, res: Response) => {
    if(req.query.for === "today") {
        res.json(await loadTodayKcalSummary());
    } else {
        res.json(await loadAllKcal());
    }
}
const getAllWeightData = async (_req: Request, res: Response) => res.json(await loadAllWeight());


const router = Router();

router.post('/input_kcal', postKcal);
router.get('/input_kcal', sendHtml)
router.post('/input_weight', postWeight);
router.get('/input_weight', sendHtml)
router.get('/kcal', getAllKcalData);
router.get('/summary_kcal', sendHtml)
router.get('/weight', getAllWeightData);
router.get('/summary_weight', sendHtml)

export { router };