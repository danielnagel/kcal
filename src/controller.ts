import { mkdir, writeFile, readFile } from "node:fs/promises";
import { isDataStructure, isKcalStructure, isUserConfigStructure, isWeightStructure } from "./typeguards";

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
    if (!isKcalStructure(reqBody)) {
        console.error("(controller) Request does not contain a valid KcalStructure object, aborting.");
        return;
    }
    const fileContent = await getStoredDataStructure();
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
        const date = getGermanDateString(new Date(d.date));
        const time = getGermanTimeString(new Date(d.date));
        return { ...d, date, time };
    })
}

const sortByDate = (a: KcalStructure | WeightStructure, b: KcalStructure | WeightStructure) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
}

const createOrUpdateDataJson = async (): Promise<void> => {
    const defaultJsonContent: DataStructure = { kcal: [], weight: [], user: { dailyKcalTarget: 2000 } };
    const jsonContent = await readFileContent();
    
    if(isDataStructure(jsonContent)) {
        // file available and correct format, nothing to do
        return;
    }

    if(jsonContent) {
        // file probably has old format and will be updated
        if(typeof (jsonContent as DataStructure).user === "undefined") {
            // user object missing
            (jsonContent as DataStructure).user = defaultJsonContent.user;
        }
        if(isDataStructure(jsonContent)) {
            // file now has correct format, write
            await writeJsonToFile(jsonContent);
            return;
        }
    }

    // possibly no file created yet
    await writeJsonToFile(defaultJsonContent);
    return;
}

const readFileContent = async (): Promise<unknown> => {
    try {
        const content = await readFile(dataFilePath, { encoding: 'utf-8' });
        const jsonContent = JSON.parse(content);
        return jsonContent;
    } catch (e: unknown) {
        // file not found, or content is not json
        return null;
    }
}


const getStoredDataStructure = async (): Promise<DataStructure> => {
    const jsonContent = await readFileContent();
    if (!isDataStructure(jsonContent)) {
        console.error(`(controller) File ${dataFilePath} has unexpected content. Aborting.`);
        return { kcal: [], weight: [], user: { dailyKcalTarget: 2000 } };
    }
    return jsonContent;
}

const sortedKcalData = async () => {
    const data = await getStoredDataStructure();
    return data.kcal.sort(sortByDate);
}

const loadAllKcal = async (): Promise<ExtendedKcalStructure[]> => {
    return splitDateTimeInData(await sortedKcalData());
}

const loadUserConfiguration = async () => {
    const data = await getStoredDataStructure();
    return data.user;
}

const storeUserConfiguration = async (reqBody: UserConfigStructure) => {
    if (!isUserConfigStructure(reqBody)) {
        console.error("(controller) Request does not contain a valid UserConfigStructure object, aborting.");
        return;
    }
    const fileContent = await getStoredDataStructure();
    fileContent.user = reqBody;
    await writeJsonToFile(fileContent);
}

const getSortedDataForDate = (date: Date, data: KcalStructure[]): KcalStructure[] => {
    const result: KcalStructure[] = [];
    const matchedData = data.filter(d => new Date(d.date).toDateString() === date.toDateString());
    if (matchedData.length === 0) return result;
    return matchedData.sort(sortByDate);
}

const sumCalories = (data: KcalStructure[]) => {
    let result = 0;
    data.forEach(d => result += parseInt(d.kcal));
    return result;
}

const getGermanDateString = (date: Date) => {
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const getGermanTimeString = (date: Date) => {
    return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

const loadTodayKcalSummary = async (): Promise<KcalSummary> => {
    const result: KcalSummary = { kcal: 0, date: "00:00", ago: 0, dailyKcalTarget: 0, pastDailyKcal: [] };
    const kcals = await sortedKcalData();
    if (kcals.length === 0) return result;
    const today = new Date();
    const matchedKcals = getSortedDataForDate(today, kcals);
    if(matchedKcals.length === 0) return result;
    result.kcal = sumCalories(matchedKcals)
    const lastDate = new Date(matchedKcals[matchedKcals.length - 1].date);
    result.date = getGermanTimeString(lastDate);
    result.ago = Math.floor((today.getTime() - lastDate.getTime()) / 1000 / 60 / 60);
    const userConfiguration = await loadUserConfiguration();
    result.dailyKcalTarget = userConfiguration.dailyKcalTarget;
    const kcalHistory = 3;
    for (let i = 0; i < kcalHistory; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i + 1));
        const matchedKcals = getSortedDataForDate(date, kcals);
        if(matchedKcals.length === 0) continue;
        result.pastDailyKcal.push({
            date: getGermanDateString(date),
            kcal: sumCalories(matchedKcals)
        });
    }
    return result;
}

const storeWeightInput = async (reqBody: WeightStructure) => {
    if (!isWeightStructure(reqBody)) {
        console.error("(controller) Request does not contain a valid WeightStructure object, aborting.");
        return;
    }
    const fileContent = await getStoredDataStructure();
    fileContent.weight.push(reqBody);
    await writeJsonToFile(fileContent);
}

const loadAllWeight = async (): Promise<WeightStructure[]> => {
    const data = await getStoredDataStructure();
    const weights = data.weight.sort(sortByDate).map(item => {
        return {
            ...item,
            date: getGermanDateString(new Date(item.date))
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
    loadUniqueKcalInput,
    loadUserConfiguration,
    storeUserConfiguration,
    createOrUpdateDataJson
};