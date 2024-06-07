import { mkdir, writeFile, readFile } from "node:fs/promises";
import { isDataStructure, isKcalStructure, isWeightStructure } from "./typeguards";

const dataDirPath = `${__dirname}/data`;
const dataFilePath = `${dataDirPath}/data.json`;

const createDataDir = async () => {
    try {
        await mkdir(dataDirPath);
    } catch (e: unknown) {
        if (e instanceof Error) {
            if (!e.message.startsWith('EEXIST')) {
                console.error(`(controller) Couldn't create directory ${dataDirPath}. Message: ${e.message}`);
            }
        }
    }
}

const writeJsonToFile = async (data: DataStructure) => {
    await createDataDir();
    try {
        await writeFile(dataFilePath, JSON.stringify(data, null, 2));
    } catch (e: unknown) {
        if (e instanceof Error) console.error(`(controller) Couldn't create file ${dataFilePath}. Message: ${e.message}`);
    }
}

const storeKcalInput = async (reqBody: KcalStructure) => {
    const fileContent = await readFileContent();
    if (!isKcalStructure(reqBody)) {
        console.error("(controller) Request does not contain a valid KcalStructure object, aborting.");
        return;
    }
    fileContent.kcal.push(reqBody);
    await writeJsonToFile(fileContent);
}

const storeMultipleKcalInput = async (reqBody: KcalStructure[]) => {
    if (!Array.isArray(reqBody)) {
        console.error("(controller) Request does not contain an array, aborting.");
        return;
    }
    for (const item of reqBody) {
        await storeKcalInput(item);
    }
}

const splitDateTimeInData = (data: KcalStructure[]): ExtendedKcalStructure[] => {
    return data.map<ExtendedKcalStructure>(d => {
        const date = new Date(d.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
        const time = new Date(d.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
        return { ...d, date, time };
    })
}

const sortByDate = (a: KcalStructure | WeightStructure, b: KcalStructure | WeightStructure) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
}

const readFileContent = async (): Promise<DataStructure> => {
    try {
        const content = await readFile(dataFilePath, { encoding: 'utf-8' });
        const dataStructure = JSON.parse(content);
        if (!isDataStructure(dataStructure)) {
            console.error(`(controller) File ${dataFilePath} has unexpected content. Aborting.`);
            return { kcal: [], weight: [] };
        }
        return dataStructure;
    } catch (e: unknown) {
        // first write
        return { kcal: [], weight: [] };
    }
}

const sortedKcalData = async () => {
    const data = await readFileContent();
    return data.kcal.sort(sortByDate);
}

const loadAllKcal = async (): Promise<ExtendedKcalStructure[]> => {
    return splitDateTimeInData(await sortedKcalData());
}

const loadTodayKcalSummary = async (): Promise<KcalSummary> => {
    const result = { kcal: 0, date: "00:00" };
    const kcals = await sortedKcalData();
    if (kcals.length === 0) return result;
    const todayKcals = kcals.filter(k => new Date(k.date).toDateString() === new Date().toDateString());
    if (todayKcals.length === 0) return result;
    const sortedTodayKcals = todayKcals.sort(sortByDate);
    sortedTodayKcals.forEach(k => result.kcal += parseInt(k.kcal));
    result.date = new Date(sortedTodayKcals[sortedTodayKcals.length - 1].date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    return result;
}

const storeWeightInput = async (reqBody: WeightStructure) => {
    const fileContent = await readFileContent();
    if (!isWeightStructure(reqBody)) {
        console.error("(controller) Request does not contain a valid WeightStructure object, aborting.");
        return;
    }
    fileContent.weight.push(reqBody);
    await writeJsonToFile(fileContent);
}

const loadAllWeight = async (): Promise<WeightStructure[]> => {
    const data = await readFileContent();
    const weights = data.weight.sort(sortByDate).map(item => {
        return {
            ...item,
            date: new Date(item.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })
        }
    });
    return weights;
}

const loadUniqueKcalInput = async (): Promise<ReducedKcalStructure[]> => {
    const kcalData = await sortedKcalData();
    const what = kcalData.map(item => item.what);
    const reducedWhat = new Set(what);
    const reducedKcal: ReducedKcalStructure[] = Array.from(reducedWhat).sort().map(item => {
        const filteredKcal = kcalData.filter(d => d.what === item);
        return { what: item, kcal: filteredKcal[filteredKcal.length - 1].kcal };
    });
    return reducedKcal;
}

export {
    storeKcalInput,
    storeMultipleKcalInput,
    loadTodayKcalSummary,
    loadAllKcal,
    storeWeightInput,
    loadAllWeight,
    loadUniqueKcalInput
};