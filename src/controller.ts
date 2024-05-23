import { Request, Response } from "express";
import { mkdir, writeFile, readFile } from "node:fs/promises";

const staticPath = __dirname + "/public";
const dataDirPath = `${__dirname}/data`;
const dataFilePath = `${dataDirPath}/data.json`;

const isDataStructure = (data: any): data is DataStructure => {
    return Array.isArray((data as DataStructure).kcal) && Array.isArray((data as DataStructure).weight);
}

const createDataDir = async () => {
    try {
        await mkdir(dataDirPath);
    } catch (e: unknown) {
        if (e instanceof Error) {
            if (!e.message.startsWith('EEXIST')) {
                console.error(`Couldn't create directory ${dataDirPath}. Message: ${e.message}`);
            }
        }
    }
}

const writeJsonToFile = async (data: DataStructure) => {
    await createDataDir();
    try {
        await writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (e: unknown) {
        if (e instanceof Error) console.error(`Couldn't create file ${dataFilePath}. Message: ${e.message}`);
    }
}

const storeKcalInput = async (reqBody: KcalStructure) => {
    const fileContent = await readFileContent();
    fileContent.kcal.push(reqBody);
    await writeJsonToFile(fileContent);
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

const sortByDate = (a: KcalStructure | WeightStructure, b: KcalStructure | WeightStructure) => {
    if(a.date < b.date) return -1;
    if(a.date > b.date) return 1;
    return 0;
}

const readFileContent = async (): Promise<DataStructure> => {
    try {
        const content = await readFile(dataFilePath, { encoding: 'utf-8' });
        const dataStructure = JSON.parse(content);
        if (!isDataStructure(dataStructure)) {
            console.error(`File ${dataFilePath} has unexpected content. Aborting.`);
            return {kcal: [], weight: []};
        }
        return dataStructure;
    } catch (e: unknown) {
        // first write
        if (e instanceof Error) console.error(`Couldn't read file ${dataFilePath}. Message: ${e.message}`);
        return {kcal: [], weight: []};
    }
}

const sortedKcalData = async () => {
    const data = await readFileContent();
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
    const fileContent = await readFileContent();
    fileContent.weight.push(reqBody);
    await writeJsonToFile(fileContent);
}

const weightInputController = (req: Request, res: Response) => {
        storeWeightInput(req.body)
        res.redirect('/input_weight');
}

const loadAllWeight = async () => {
    const data = await readFileContent();
    const weights = data.weight.sort(sortByDate).map(item => {
        return {
            weight: item.weight,
            date: new Date(item.date).toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"})
        }
    });
    return weights;
}

const allWeightDataController = async (req: Request, res: Response) => {
    res.json(await loadAllWeight());
}

const sendHtml = (req: Request, res: Response) => res.sendFile(`${staticPath}${req.url}.html`);

export {
    kcalInputController,
    allKcalDataController,
    weightInputController,
    allWeightDataController,
    sendHtml
};