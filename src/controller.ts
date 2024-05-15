import { Request, Response } from "express";

const staticPath = __dirname + "/public";
const sendHtml = (req: Request, res: Response) => res.sendFile(`${staticPath}${req.url}.html`);

export { sendHtml };