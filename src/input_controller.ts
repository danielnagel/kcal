import { Request, Response } from "express";
import { mkdir, writeFile, readFile } from "node:fs/promises";


type KcalStructure = { what: string, date: string, kcal: string, comment: string };
type ExtendedKcalStructure = { what: string, date: string, time: string, kcal: string, comment: string };
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
            await writeFile(filePath, JSON.stringify(dataStructure, null, 2));
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
            await writeFile(filePath, JSON.stringify(dataStructure, null, 2));
        } catch (e: unknown) {
            if (e instanceof Error) console.error(`Couldn't create file ${filePath}. Message: ${e.message}`);
        }
    }
}

const kcalInputController = (req: Request, res: Response) => {
    storeKcalInput(req.body)
    res.redirect('/input_kcal');
}

const splitDateTimeInData = (data: KcalStructure[]): ExtendedKcalStructure[] => {
    return data.map<ExtendedKcalStructure>(d => {
        const date = new Date(d.date).toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"});
        const time = new Date(d.date).toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"});
        return {...d, date, time};
    })
}

const sortByDate = (a: KcalStructure, b: KcalStructure) => {
    if(a.date < b.date) return -1;
    if(a.date > b.date) return 1;
    return 0;
}

const loadFile = async (): Promise<DataStructure> => {
    const filePath = `${__dirname}/data/data.json`;
    try {
        const content = await readFile(filePath, { encoding: 'utf-8' });
        const dataStructure = JSON.parse(content);
        if (!isDataStructure(dataStructure)) {
            console.error(`File ${filePath} has unexpected content. Aborting.`);
            return {kcal: [], weight: []};
        }
        return dataStructure;
    } catch (e: unknown) {
        // first write
        if (e instanceof Error) console.error(`Couldn't read file ${filePath}. Message: ${e.message}`);
        return {kcal: [], weight: []};
    }
}

const sortedKcalData = async () => {
    const data = await loadFile();
    return data.kcal.sort(sortByDate);
}

const loadAllKcal = async (): Promise<ExtendedKcalStructure[]> => {
    return splitDateTimeInData(await sortedKcalData());
}

const loadTodayKcalSummary = async (): Promise<{kcal: number, time: string}> => {
    const result = {kcal: 0, time: "00:00"};
    const kcals = await sortedKcalData();
    if(kcals.length === 0) return result;
    const todayKcals = kcals.filter(k => new Date(k.date).toDateString() === new Date().toDateString());
    if(todayKcals.length === 0) return result;
    const sortedTodayKcals = todayKcals.sort(sortByDate);
    sortedTodayKcals.forEach(k => result.kcal += parseInt(k.kcal));
    result.time = new Date(sortedTodayKcals[sortedTodayKcals.length -1].date).toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"});
    return result;
}

const allKcalDataController = async (req: Request, res: Response) => {
    if(req.query.for === "today") {
        res.json(await loadTodayKcalSummary());
    } else {
        res.json(await loadAllKcal());
    }
}

const storeWeightInput = async (reqBody: WeightStructure) => {
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
        dataStructure.weight.push(reqBody);
        try {
            await writeFile(filePath, JSON.stringify(dataStructure, null, 2));
        } catch (e: unknown) {
            if (e instanceof Error) console.error(`Couldn't create file ${filePath}. Message: ${e.message}`);
        }
    } catch (e: unknown) {
        // first write
        const dataStructure: DataStructure = {
            kcal: [],
            weight: [reqBody]
        }
        try {
            await writeFile(filePath, JSON.stringify(dataStructure, null, 2));
        } catch (e: unknown) {
            if (e instanceof Error) console.error(`Couldn't create file ${filePath}. Message: ${e.message}`);
        }
    }
}

const weightInputController = (req: Request, res: Response) => {
        storeWeightInput(req.body)
        res.redirect('/input_weight');
}

const loadAllWeight = async () => {
    const data = await loadFile();
    return data.weight;
}

const allWeightDataController = async (req: Request, res: Response) => {
    res.json(await loadAllWeight());
}

export { kcalInputController, allKcalDataController, weightInputController, allWeightDataController };