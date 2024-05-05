import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { mkdir, writeFile, readFile } from "node:fs/promises";

const app = express();
const router = express.Router();

const path = __dirname + "/frontend/";
const port = 8080;

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

type KcalStructure = { what: string, time: string, kcal: string, comment: string };
type WeightStructure = {weight: string, date: string};
type DataStructure = {kcal: KcalStructure[], weight: WeightStructure[]};

const isDataStructure = (data: any): data is DataStructure => {
    return Array.isArray((data as DataStructure).kcal) && Array.isArray((data as DataStructure).weight);
}

const storeKcalInput = async (reqBody: KcalStructure) => {
    const path = `${__dirname}/data`;
    try {
        await mkdir(path);
    } catch (e: unknown) {
        if (e instanceof Error) {
            if(!e.message.startsWith('EEXIST')) {
                console.error(`Couldn't create directory ${path}. Message: ${e.message}`);
                return;
            }
        }
    }
    const filePath = `${path}/data.json`;
    try {
        const content = await readFile(filePath, {encoding: 'utf-8'});
        const dataStructure = JSON.parse(content);
        if(!isDataStructure(dataStructure)) {
            console.error(`File ${filePath} has unexpected content. Aborting.`);
            return;
        }
        dataStructure.kcal.push(reqBody);
        try {
            await writeFile(filePath, JSON.stringify(dataStructure));
        } catch (e: unknown) {
            if (e instanceof Error) console.error(`Couldn't create file ${filePath}. Message: ${e.message}`);
        }
    } catch (e: unknown) {
        // first write
        const dataStructure: DataStructure = {
            kcal: [reqBody],
            weight: []
        }
        try {
            await writeFile(filePath, JSON.stringify(dataStructure));
        } catch (e: unknown) {
            if (e instanceof Error) console.error(`Couldn't create file ${filePath}. Message: ${e.message}`);
        }
    }
}

const kcalInputController = (req: Request, res: Response) => {
    storeKcalInput(req.body)
    res.redirect('/kcal_input?status=200');
}

router.post('/kcal_input', kcalInputController);

app.use(express.static(path));
app.use('/', router);


app.listen(port, () => {
    console.log(`listening on port ${port} ...`);
});