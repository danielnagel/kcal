import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { isDataStructure, isKcalStructure, isUserConfigStructure, isWeightStructure } from "./typeguards";

const dataDirPath = `${__dirname}/data`;
const dataFilePath = `${dataDirPath}/data.json`;

const createDataDir = async () => {
	try {
		await mkdir(dataDirPath);
	} catch (e: unknown) {
		if (e instanceof Error) {
			// TODO: test
			if (!e.message.startsWith('EEXIST')) {
				console.error(`(controller) Couldn't create directory ${dataDirPath}. Message: ${e.message}`);
			}
		}
	}
}

const writeJsonToFile = async (path: string, data: DataStructure) => {
	await createDataDir();
	try {
		await writeFile(path, JSON.stringify(data, null, 2));
	} catch (e: unknown) {
		// TODO: test
		if (e instanceof Error) console.error(`(controller) Couldn't create file ${path}. Message: ${e.message}`);
	}
}

const storeKcalInput = async (reqBody: KcalStructure, user: string) => {
	if (!isKcalStructure(reqBody)) {
		// TODO: test
		console.error("(controller) Request does not contain a valid KcalStructure object, aborting.");
		return;
	}
	const fileContent = await getStoredDataStructure(user);
	fileContent.kcal.push(reqBody);
	await writeJsonToFile(`${dataDirPath}/${user}.json`, fileContent);
}

const storeMultipleKcalInput = async (reqBody: KcalStructure[], user: string) => {
	if (!Array.isArray(reqBody)) {
		// TODO: test
		console.error("(controller) Request does not contain an array, aborting.");
		return;
	}
	for (const item of reqBody) {
		await storeKcalInput(item, user);
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

const getFileContentForUser = async (user: string): Promise<unknown> => {
	const userFilePath = `${dataDirPath}/${user}.json`;
	const userContent = await readFileContent(`${dataDirPath}/${user}.json`);
	if (userContent !== null) return userContent;

	// there might be an old data.json in the system, move it to user.json
	const dataContent = await readFileContent(dataFilePath);
	if (isDataStructure(dataContent)) {
		dataContent.user.user = user;
		await writeJsonToFile(userFilePath, dataContent);
		await rm(dataFilePath);
		return dataContent;
	}

	// there is no user.json and no data.json, create user.json
	const defaultJsonContent: DataStructure = { kcal: [], weight: [], user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3, user } };
	await writeJsonToFile(userFilePath, defaultJsonContent);
	return defaultJsonContent;
}

const readFileContent = async (path: string): Promise<unknown> => {
	// TODO: is there user.json?
	try {
		const content = await readFile(path, { encoding: 'utf-8' });
		const jsonContent = JSON.parse(content);
		return jsonContent;
	} catch (e: unknown) {
		// file not found, or content is not json
		return null;
	}
}


const getStoredDataStructure = async (user: string): Promise<DataStructure> => {
	const jsonContent = await getFileContentForUser(user);
	if (!isDataStructure(jsonContent)) {
		// TODO: test
		console.error(`(controller) File ${dataFilePath} has unexpected content. Aborting.`);
		return { kcal: [], weight: [], user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3, user: "" } };
	}
	return jsonContent;
}

const sortedKcalData = async (user: string) => {
	const data = await getStoredDataStructure(user);
	return data.kcal.sort(sortByDate);
}

const loadAllKcal = async (user: string): Promise<ExtendedKcalStructure[]> => {
	return splitDateTimeInData(await sortedKcalData(user));
}

const loadUserConfiguration = async (user: string) => {
	const data = await getStoredDataStructure(user);
	return data.user;
}

const storeUserConfiguration = async (reqBody: UserConfigStructure, user: string) => {
	if (!isUserConfigStructure(reqBody)) {
		// TODO: test
		console.error("(controller) Request does not contain a valid UserConfigStructure object, aborting.");
		return;
	}
	const fileContent = await getStoredDataStructure(user);
	fileContent.user = reqBody;
	await writeJsonToFile(`${dataDirPath}/${user}.json`, fileContent);
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

const getGermanMonthString = (date: Date) => {
	return date.toLocaleDateString("de-DE", {
		month: "2-digit",
		year: "numeric",
	})
}

const getGermanTimeString = (date: Date) => {
	return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

const loadTodayKcalSummary = async (user: string): Promise<KcalSummary> => {
	const result: KcalSummary = { todayKcal: 0, lastMealTime: "00:00", lastMealAgo: 0, dailyKcalTarget: 0, pastDailyKcal: [], actualKcalHistorySum: 0, expectedKcalHistorySum: 0, kcalHistorySumDifference: 0 };
	const {dailyKcalTarget, kcalHistoryCount} = await loadUserConfiguration(user);
	result.dailyKcalTarget = dailyKcalTarget;
	const kcals = await sortedKcalData(user);
	if (kcals.length === 0) return result;
	const today = new Date();
	const matchedKcals = getSortedDataForDate(today, kcals);
	if(matchedKcals.length) {
		result.todayKcal = sumCalories(matchedKcals)
		const lastDate = new Date(matchedKcals[matchedKcals.length - 1].date);
		result.lastMealTime = getGermanTimeString(lastDate);
		result.lastMealAgo = Math.floor((today.getTime() - lastDate.getTime()) / 1000 / 60 / 60);
	}
	for (let i = 0; i < kcalHistoryCount; i++) {
		const date = new Date();
		date.setDate(date.getDate() - (i + 1));
		const matchedKcals = getSortedDataForDate(date, kcals);
		if(matchedKcals.length === 0) continue;
		const summedCalories = sumCalories(matchedKcals);
		result.pastDailyKcal.push({
			date: getGermanDateString(date),
			kcal: summedCalories
		});
		result.actualKcalHistorySum += summedCalories;
	}
	if (result.pastDailyKcal.length > 0) {
		result.expectedKcalHistorySum = dailyKcalTarget * result.pastDailyKcal.length;
		result.kcalHistorySumDifference = result.actualKcalHistorySum - result.expectedKcalHistorySum;
	}
	return result;
}

const storeWeightInput = async (reqBody: WeightStructure, user: string) => {
	if (!isWeightStructure(reqBody)) {
		console.error("(controller) Request does not contain a valid WeightStructure object, aborting.");
		return;
	}
	const fileContent = await getStoredDataStructure(user);
	fileContent.weight.push(reqBody);
	await writeJsonToFile(`${dataDirPath}/${user}.json`, fileContent);
}

const storeMultipleWeightInput = async (reqBody: WeightStructure[], user: string) => {
	if (!Array.isArray(reqBody)) {
		// TODO: test
		console.error("(controller) Request does not contain an array, aborting.")
		return
	}
	for (const item of reqBody) {
		await storeWeightInput(item, user);
	}
}

const loadAllWeight = async (user: string): Promise<WeightStructure[]> => {
	const data = await getStoredDataStructure(user);
	const weights = data.weight.sort(sortByDate).map(item => {
		return {
			...item,
			date: getGermanDateString(new Date(item.date))
		}
	});
	return weights;
}

const loadUniqueKcalInput = async (user: string): Promise<ReducedKcalStructure[]> => {
	const kcalData = await sortedKcalData(user);
	const what = kcalData.map(item => item.what);
	const reducedWhat = new Set(what);
	const reducedKcal: ReducedKcalStructure[] = Array.from(reducedWhat).sort().map(item => {
		const filteredKcal = kcalData.filter(d => d.what === item);
		return { what: item, kcal: filteredKcal[filteredKcal.length - 1].kcal };
	});
	return reducedKcal;
}

const loadWeightTarget = async (user: string): Promise<WeightTargetSummary> => {
	const userConfiguration = await loadUserConfiguration(user);
	const weights = await loadAllWeight(user);
	const mostRecentWeight = weights[weights.length - 1];
	const difference = parseInt(mostRecentWeight.weight) - userConfiguration.weightTarget;
	const twoKiloPerMonth = Math.round(difference / 2);
	const twoKiloDate = new Date();
	twoKiloDate.setMonth(twoKiloDate.getMonth() + twoKiloPerMonth);
	const twoKiloPrediction = getGermanMonthString(twoKiloDate);
	const oneKiloPerMonth = Math.round(difference);
	const oneKiloDate = new Date()
	oneKiloDate.setMonth(oneKiloDate.getMonth() + oneKiloPerMonth)
	const oneKiloPrediction = getGermanMonthString(oneKiloDate);
	return {
		weightTarget: userConfiguration.weightTarget, twoKiloPrediction, oneKiloPrediction
	};
}

export {
	storeKcalInput,
	storeMultipleKcalInput,
	loadTodayKcalSummary,
	loadAllKcal,
	storeWeightInput,
	storeMultipleWeightInput,
	loadAllWeight,
	loadUniqueKcalInput,
	loadUserConfiguration,
	storeUserConfiguration,
	loadWeightTarget
};