import {
	mkdir,
	writeFile,
	readFile,
	rm 
} from 'node:fs/promises';
import {
	isDataStructure,
	isKcalStructure,
	isUserConfigStructure,
	isWeightStructure 
} from './typeguards';

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
};

const writeJsonToFile = async (path: string, data: DataStructure) => {
	await createDataDir();
	try {
		await writeFile(path, JSON.stringify(data, null, 2));
	} catch (e: unknown) {
		if (e instanceof Error) console.error(`(controller) Couldn't create file ${path}. Message: ${e.message}`);
	}
};

const storeKcalInput = async (reqBody: KcalStructure, user: string) => {
	if (!isKcalStructure(reqBody)) {
		console.error('(controller) Request does not contain a valid KcalStructure object, aborting.');
		return;
	}
	const fileContent = await getStoredDataStructure(user);

	const uniqueKcalStructure: UniqueKcalStructure = {
		...reqBody,
		id: 0
	};
	if (fileContent.kcal.length > 0) {
		uniqueKcalStructure.id = fileContent.kcal[fileContent.kcal.length -1].id + 1;
	}

	fileContent.kcal.push(uniqueKcalStructure);
	await writeJsonToFile(`${dataDirPath}/${user}.json`, fileContent);
};

const storeMultipleKcalInput = async (reqBody: KcalStructure[], user: string) => {
	if (!Array.isArray(reqBody)) {
		console.error('(controller) Request does not contain an array, aborting.');
		return;
	}
	for (const item of reqBody) {
		await storeKcalInput(item, user);
	}
};

const splitDateTimeInData = (data: UniqueKcalStructure[]): ExtendedKcalStructure[] => {
	return data.map<ExtendedKcalStructure>(d => {
		const date = getGermanDateString(new Date(d.date));
		const time = getGermanTimeString(new Date(d.date));
		return {
			...d,
			date,
			time 
		};
	});
};

const sortByDateAsc = (a: KcalStructure | WeightStructure, b: KcalStructure | WeightStructure) => {
	if (a.date < b.date) return -1;
	if (a.date > b.date) return 1;
	return 0;
};

const sortByDateDesc = (a: KcalStructure | WeightStructure, b: KcalStructure | WeightStructure) => {
	if (a.date < b.date) return 1;
	if (a.date > b.date) return -1;
	return 0;
};

const moveDataJsonToUserJson = async (user: string): Promise<DataStructure | null> => {
	const userFilePath = `${dataDirPath}/${user}.json`;
	const dataContent = await readFileContent(dataFilePath);
	if (!isDataStructure(dataContent)) {
		console.error('There is no "data.json" will not update.');
		return null;
	}
	dataContent.user.user = user;
	await writeJsonToFile(userFilePath, dataContent);
	await rm(dataFilePath);
	return dataContent;
};

const createUserJson = async (user: string): Promise<DataStructure | null> => {
	if (user === null || user === undefined || user.length === 0) {
		console.error('Username has to be at least one character long, user.json creation aborted.');
		return null;
	}
	const userFilePath = `${dataDirPath}/${user}.json`;
	const defaultJsonContent: DataStructure = {
		kcal: [],
		weight: [],
		user: {
			dailyKcalTarget: 2000,
			weightTarget: 90,
			color: '#5f9ea0',
			kcalHistoryCount: 3,
			user 
		} 
	};
	await writeJsonToFile(userFilePath, defaultJsonContent);
	return defaultJsonContent;
};

const getFileContentForUser = async (user: string): Promise<unknown> => {
	const userContent = await readFileContent(`${dataDirPath}/${user}.json`);
	if (userContent !== null) return userContent;

	// there might be an old data.json in the system, move it to user.json
	const updatedJson = await moveDataJsonToUserJson(user);
	if (updatedJson) return updatedJson;

	// there is no user.json and no data.json, create user.json
	return createUserJson(user);
};

const readFileContent = async (path: string): Promise<unknown> => {
	try {
		const content = await readFile(path, {
			encoding: 'utf-8' 
		});
		const jsonContent = JSON.parse(content);
		return jsonContent;
	} catch (e: unknown) {
		// file not found, or content is not json
		if (e instanceof Error) console.error(`Could not read file content of ${path}: ${e.message}`);
		return null;
	}
};

const getStoredDataStructure = async (user: string): Promise<DataStructure> => {
	const jsonContent = await getFileContentForUser(user);
	if (!isDataStructure(jsonContent)) {
		console.error(`(controller) File ${dataFilePath} has unexpected content. Aborting.`);
		return {
			kcal: [],
			weight: [],
			user: {
				dailyKcalTarget: 2000,
				weightTarget: 90,
				color: '#5f9ea0',
				kcalHistoryCount: 3,
				user: '' 
			} 
		};
	}
	return jsonContent;
};

const sortedKcalData = async (user: string, order = 'asc') => {
	const data = await getStoredDataStructure(user);
	if (order === 'desc') return data.kcal.sort(sortByDateDesc);
	return data.kcal.sort(sortByDateAsc);
};

const loadAllKcal = async (user: string, order = 'asc', page = 0, pageSize = 25): Promise<ExtendedKcalStructure[]> => {
	const data = splitDateTimeInData(await sortedKcalData(user, order));
	if (page === 0)
		return data;
	const end = page * pageSize;
	const start = end - pageSize;
	return data.slice(start, end);
};

const loadUserConfiguration = async (user: string) => {
	const data = await getStoredDataStructure(user);
	return data.user;
};

const storeUserConfiguration = async (reqBody: UserConfigStructure, user: string) => {
	if (!isUserConfigStructure(reqBody)) {
		console.error('(controller) Request does not contain a valid UserConfigStructure object, aborting.');
		return;
	}
	const fileContent = await getStoredDataStructure(user);
	fileContent.user = reqBody;
	await writeJsonToFile(`${dataDirPath}/${user}.json`, fileContent);
};

const getSortedDataForDate = (date: Date, data: KcalStructure[]): KcalStructure[] => {
	const result: KcalStructure[] = [];
	const matchedData = data.filter(d => new Date(d.date).toDateString() === date.toDateString());
	if (matchedData.length === 0) return result;
	return matchedData.sort(sortByDateAsc);
};

const sumCalories = (data: KcalStructure[]) => {
	let result = 0;
	data.forEach(d => result += parseInt(d.kcal));
	return result;
};

const getGermanDateString = (date: Date) => {
	return date.toLocaleDateString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric' 
	});
};

const getGermanMonthString = (date: Date) => {
	return date.toLocaleDateString('de-DE', {
		month: '2-digit',
		year: 'numeric',
	});
};

const getGermanTimeString = (date: Date) => {
	return date.toLocaleTimeString('de-DE', {
		hour: '2-digit',
		minute: '2-digit' 
	});
};

const loadTodayKcalSummary = async (user: string): Promise<KcalSummary> => {
	const result: KcalSummary = {
		todayKcal: 0,
		lastMealTime: '00:00',
		lastMealAgo: 0,
		dailyKcalTarget: 0,
		pastDailyKcal: [],
		actualKcalHistorySum: 0,
		expectedKcalHistorySum: 0,
		kcalHistorySumDifference: 0 
	};
	const {dailyKcalTarget, kcalHistoryCount} = await loadUserConfiguration(user);
	result.dailyKcalTarget = dailyKcalTarget;
	const kcals = await sortedKcalData(user);
	if (kcals.length === 0) return result;
	const today = new Date();
	const matchedKcals = getSortedDataForDate(today, kcals);
	if (matchedKcals.length) {
		result.todayKcal = sumCalories(matchedKcals);
		const lastDate = new Date(matchedKcals[matchedKcals.length - 1].date);
		result.lastMealTime = getGermanTimeString(lastDate);
		result.lastMealAgo = Math.floor((today.getTime() - lastDate.getTime()) / 1000 / 60 / 60);
	}
	for (let i = 0; i < kcalHistoryCount; i++) {
		const date = new Date();
		date.setDate(date.getDate() - (i + 1));
		const matchedKcals = getSortedDataForDate(date, kcals);
		if (matchedKcals.length === 0) continue;
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
};

const storeWeightInput = async (reqBody: WeightStructure, user: string) => {
	if (!isWeightStructure(reqBody)) {
		console.error('(controller) Request does not contain a valid WeightStructure object, aborting.');
		return;
	}
	const fileContent = await getStoredDataStructure(user);

	const uniqueWeightStructure: UniqueWeightStructure = {
		...reqBody,
		id: 0
	};
	if (fileContent.weight.length > 0) {
		uniqueWeightStructure.id = fileContent.weight[fileContent.weight.length -1].id + 1;
	}

	fileContent.weight.push(uniqueWeightStructure);
	await writeJsonToFile(`${dataDirPath}/${user}.json`, fileContent);
};

const storeMultipleWeightInput = async (reqBody: WeightStructure[], user: string) => {
	if (!Array.isArray(reqBody)) {
		console.error('(controller) Request does not contain an array, aborting.');
		return;
	}
	for (const item of reqBody) {
		await storeWeightInput(item, user);
	}
};

const loadAllWeight = async (user: string): Promise<WeightStructure[]> => {
	const data = await getStoredDataStructure(user);
	const weights = data.weight.sort(sortByDateAsc).map(item => {
		return {
			...item,
			date: getGermanDateString(new Date(item.date))
		};
	});
	return weights;
};

const loadUniqueKcalInput = async (user: string): Promise<ReducedKcalStructure[]> => {
	const kcalData = await sortedKcalData(user);
	const what = kcalData.map(item => item.what);
	const reducedWhat = new Set(what);
	const reducedKcal: ReducedKcalStructure[] = Array.from(reducedWhat).sort().map(item => {
		const filteredKcal = kcalData.filter(d => d.what === item);
		return {
			what: item,
			kcal: filteredKcal[filteredKcal.length - 1].kcal 
		};
	});
	return reducedKcal;
};

const loadWeightTarget = async (user: string): Promise<WeightTargetSummary> => {
	const result: WeightTargetSummary = {
		weightTarget: 0,
		twoKiloPrediction: '',
		oneKiloPrediction: ''
	};
	const userConfiguration = await loadUserConfiguration(user);
	const weights = await loadAllWeight(user);
	if (weights.length === 0) return result;
	const mostRecentWeight = weights[weights.length - 1];
	const difference = parseInt(mostRecentWeight.weight) - userConfiguration.weightTarget;
	const twoKiloPerMonth = Math.round(difference / 2);
	const twoKiloDate = new Date();
	twoKiloDate.setMonth(twoKiloDate.getMonth() + twoKiloPerMonth);
	const twoKiloPrediction = getGermanMonthString(twoKiloDate);
	const oneKiloPerMonth = Math.round(difference);
	const oneKiloDate = new Date();
	oneKiloDate.setMonth(oneKiloDate.getMonth() + oneKiloPerMonth);
	const oneKiloPrediction = getGermanMonthString(oneKiloDate);
	return {
		weightTarget: userConfiguration.weightTarget,
		twoKiloPrediction,
		oneKiloPrediction
	};
};

const updateUserJson = async (user: string, newUser: string): Promise<DataStructure | null> => {
	if (newUser === null || newUser === undefined || newUser.length === 0) {
		console.error('New username has to be at least one character long, new-user.json creation aborted.');
		return null;
	}
	const userFilePath = `${dataDirPath}/${user}.json`;
	const newUserFilePath = `${dataDirPath}/${newUser}.json`;
	const userContent = await readFileContent(userFilePath);
	if (!isDataStructure(userContent)) {
		console.error(`There is no "${user}.json" will not update.`);
		return null;
	}
	userContent.user.user = newUser;
	await writeJsonToFile(newUserFilePath, userContent);
	await rm(userFilePath);
	return userContent;
};

const deleteKcal = async (user: string, id: string) => {
	const data = await getStoredDataStructure(user);
	const kcal = data.kcal;
	if (kcal.length === 0) {
		throw Error('There is no data to delete.');
	}

	let idNumber: number;
	try {
		idNumber = parseInt(id);
	} catch (e: unknown) {
		let message = `Could not parse '${id}'`;
		if (e instanceof Error) message += `, reason: ${e.message}`;
		throw Error(message);
	}

	const updatedKcal = kcal.filter(k => k.id !== idNumber);
	if (updatedKcal.length !== kcal.length - 1) {
		throw Error('Deleted to much data, kcal list probably inconsistent. Aborted to prevent data loss.');
	}
	data.kcal = updatedKcal;
	await writeJsonToFile(`${dataDirPath}/${user}.json`, data);
};

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
	loadWeightTarget,
	createUserJson,
	updateUserJson,
	deleteKcal
};