import express from "express";
import { kcalInputController, allKcalDataController } from "./input_controller";
import { sendHtml } from "./controller";

const router = express.Router();

router.post('/input', kcalInputController);
router.get('/input', sendHtml)
router.get('/kcal', allKcalDataController);
router.get('/summary', sendHtml)

export { router };