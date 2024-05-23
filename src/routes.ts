import express from "express";
import {
    kcalInputController,
    allKcalDataController,
    weightInputController,
    allWeightDataController,
    sendHtml
} from "./controller";

const router = express.Router();

router.post('/input_kcal', kcalInputController);
router.get('/input_kcal', sendHtml)
router.post('/input_weight', weightInputController);
router.get('/input_weight', sendHtml)
router.get('/kcal', allKcalDataController);
router.get('/summary_kcal', sendHtml)
router.get('/weight', allWeightDataController);
router.get('/summary_weight', sendHtml)

export { router };