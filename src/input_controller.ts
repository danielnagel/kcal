import { Request, Response } from "express";
import { mkdir, writeFile, readFile } from "node:fs/promises";


type KcalStructure = { what: string, time: string, kcal: string, comment: string };
type WeightStructure = { weight: string, date: string };
type DataStructure = { kcal: KcalStructure[], weight: WeightStructure[] };

const isDataStructure = (data: any): data is DataStructure => {
    return Array.isArray((data as DataStructure).kcal) && Array.isArray((data as DataStructure).weight);
}

const storeKcalInput = async (reqBody: KcalStructure) => {
    const path = `${__dirname}/data`;
    try {
        await mkdir(path);
    } catch (e: unknown) {
        if (e instanceof Error) {
            if (!e.message.startsWith('EEXIST')) {
                console.error(`Couldn't create directory ${path}. Message: ${e.message}`);
                return;
            }
        }
    }
    const filePath = `${path}/data.json`;
    try {
        const content = await readFile(filePath, { encoding: 'utf-8' });
        const dataStructure = JSON.parse(content);
        if (!isDataStructure(dataStructure)) {
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
    res.redirect('/input');
}

const loadAllKcal = async (): Promise<KcalStructure[]> => {
    const filePath = `${__dirname}/data/data.json`;
    try {
        const content = await readFile(filePath, { encoding: 'utf-8' });
        const dataStructure = JSON.parse(content);
        if (!isDataStructure(dataStructure)) {
            console.error(`File ${filePath} has unexpected content. Aborting.`);
            return [];
        }
        return dataStructure.kcal;
    } catch (e: unknown) {
        // first write
        if (e instanceof Error) console.error(`Couldn't read file ${filePath}. Message: ${e.message}`);
        return [];
    }
}

const allKcalDataController = async (_req: Request, res: Response) => {
    res.json(await loadAllKcal());
}

export { kcalInputController, allKcalDataController };