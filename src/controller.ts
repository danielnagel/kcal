import {
	mkdir,
	writeFile,
	readFile,
	rm 
} from 'node:fs/promises';
import {
	isDataStructure,
	isKcalStructure,
	isUniqueKcalStructure,
	isUserConfigStructure,
	isWeightStructure 
} from './typeguards';
import {
	ParseError, ReadError 
} from './customErrors';

const dataDirPath = `${__dirname}/data`;
const dataFilePath = `${dataDirPath}/data.json`;

const createDataDir = async () => {
	try {
		await mkdir(dataDirPath);
	} catch (e: unknown) {
		if (e instanceof Error) {
			if (!e.message.startsWith('EEXIST')) {
				throw Error(`Couldn't create directory ${dataDirPath}. Reason: ${e.message}`);
			}
		}
	}
};

const writeJsonToFile = async (path: string, data: DataStructure) => {
	try {
		await createDataDir();
		await writeFile(path, JSON.stringify(data, null, 2));
	} catch (e: unknown) {
		let message = `Couldn't create file ${path}.`;
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		throw Error(message);
	}
};

const storeKcalInput = async (reqBody: KcalStructure, user: string) => {
	if (!isKcalStructure(reqBody)) {
		throw Error('Request does not contain a valid KcalStructure object.');
	}
	const fileContent = await getStoredDataStructure(user);

	const uniqueKcalStructure: UniqueKcalStructure = {
		...reqBody,
		id: 0
	};
	if (fileContent.kcal.length > 0) {
		uniqueKcalStructure.id = fileContent.kcal[fileContent.kcal.length - 1].id + 1;
	}

	fileContent.kcal.push(uniqueKcalStructure);
	await writeJsonToFile(`${dataDirPath}/${user}.json`, fileContent);
};

const storeMultipleKcalInput = async (reqBody: KcalStructure[], user?: string) => {
	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}
	if (!Array.isArray(reqBody)) {
		throw Error('Request does not contain an array.');
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

const createUserJson = async (user: string): Promise<DataStructure | null> => {
	if (user === null || user === undefined || user.length === 0) {
		throw Error('Username has to be at least one character long.');
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
	try {
		return await readFileContent(`${dataDirPath}/${user}.json`);
	} catch (e: unknown) {
		if (e instanceof ReadError) {
			// there is no user.json, create user.json
			return createUserJson(user);
		}
		let message = `Could not get file content for user '${user}'.`;
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		throw Error(message);
	}
};

const readFileContent = async (path: string): Promise<unknown> => {
	let content = null;
	try {
		content = await readFile(path, {
			encoding: 'utf-8' 
		});
	} catch (e: unknown) {
		let message = `Could not read file '${path}'.`;
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		throw new ReadError(message);
	}

	try {
		const jsonContent = JSON.parse(content);
		return jsonContent;
	} catch (e: unknown) {
		let message = `Could not parse json '${path}'.`;
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		throw new ParseError(message);
	}
};

const getStoredDataStructure = async (user: string): Promise<DataStructure> => {
	try {
		const jsonContent = await getFileContentForUser(user);
		if (!isDataStructure(jsonContent)) {
			throw Error(`Content of file '${dataFilePath}' is not a DataStucture.`);
		}
		return jsonContent;
	} catch (e: unknown) {
		let message = 'Could not get stored data structure.';
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		throw Error(message);
	}
};

const sortedKcalData = async (user: string, order = 'asc') => {
	const data = await getStoredDataStructure(user);
	if (order === 'desc') return data.kcal.sort(sortByDateDesc);
	return data.kcal.sort(sortByDateAsc);
};

const loadAllKcal = async (user: string, page?: string, order = 'asc', pageSize = 25): Promise<ExtendedKcalStructure[]> => {
	let pageNumber = 0;
	if (page !== undefined) {
		pageNumber = parseInt(page);
		if (isNaN(pageNumber)) {
			const message = 'Could not parse page number.';
			throw Error(message);
		}
	}
	const data = splitDateTimeInData(await sortedKcalData(user, order));
	if (pageNumber === 0)
		return data;
	const end = pageNumber * pageSize;
	const start = end - pageSize;
	return data.slice(start, end);
};

const handleGetAllKcalData = async (query: LoadKcalParameters) => {
	const { range, order, page, select, user } = query;

	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}

	if (range === 'today') {
		return loadTodayKcalSummary(user);
	} else if (select === 'what') {
		return loadUniqueKcalInput(user);
	}
	return loadAllKcal(user, page as string, order as string);
};

const loadUserConfiguration = async (user?: string) => {
	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}
	const data = await getStoredDataStructure(user);
	return data.user;
};

const storeUserConfiguration = async (reqBody: UserConfigStructure, user?: string) => {
	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}
	if (!isUserConfigStructure(reqBody)) {
		throw Error('Request does not contain a valid UserConfigStructure object.');
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
	const { dailyKcalTarget, kcalHistoryCount } = await loadUserConfiguration(user);
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

const storeWeightInput = async (reqBody: WeightStructure, user?: string) => {
	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}
	if (!isWeightStructure(reqBody)) {
		throw Error('Request does not contain a valid WeightStructure object.');
	}
	const fileContent = await getStoredDataStructure(user);

	const uniqueWeightStructure: UniqueWeightStructure = {
		...reqBody,
		id: 0
	};
	if (fileContent.weight.length > 0) {
		uniqueWeightStructure.id = fileContent.weight[fileContent.weight.length - 1].id + 1;
	}

	fileContent.weight.push(uniqueWeightStructure);
	await writeJsonToFile(`${dataDirPath}/${user}.json`, fileContent);
};

const storeMultipleWeightInput = async (reqBody: WeightStructure[], user?: string) => {
	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}
	if (!Array.isArray(reqBody)) {
		throw Error('Request does not contain an array.');
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

const handleGetAllWeightData = async (query: LoadWeightParameters) => {
	const { user, summary } = query;
	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}
	if (summary === 'true') {
		return loadWeightTarget(user);
	}
	return loadAllWeight(user);
};

const updateUserJson = async (user: string, newUser: string): Promise<DataStructure | null> => {
	if (newUser === null || newUser === undefined || newUser.length === 0) {
		throw Error('New username has to be at least one character long.');
	}
	const userFilePath = `${dataDirPath}/${user}.json`;
	const newUserFilePath = `${dataDirPath}/${newUser}.json`;
	let userContent;
	try {
		userContent = await readFileContent(userFilePath);
	} catch (e: unknown) {
		let message = `Could not get file content for user '${user}'.`;
		if (e instanceof Error) message += ` Reason: ${e.message}`;
		throw Error(message);
	}

	if (!isDataStructure(userContent)) {
		throw Error(`There is no "${user}.json" to update.`);
	}
	userContent.user.user = newUser;
	await writeJsonToFile(newUserFilePath, userContent);
	await rm(userFilePath);
	return userContent;
};

/**
 * Deletes kcal entry which matches the given id.
 * 
 * Throws an error, when user is undefined,
 * id is undefined, no data is available or to much is deleted.
 * 
 * @param user string to match the users data json.
 * @param id for the entry to delete
 */
const deleteKcal = async (user?: string, id?: string) => {
	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}
	if (id === undefined) {
		throw Error('Request must contain an id.');
	}
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

/**
 * Updates kcal entry which matches the given id.
 * 
 * Throws an error, when user is undefined,
 * updated structure is no UniqueKcalStructure, no data is available or id was not found.
 * 
 * @param user string to match the users data json.
 * @param id for the entry to delete
 */
const updateKcal = async (reqBody: UniqueKcalStructure, user?: string) => {
	if (user === undefined) {
		throw Error('Request must contain a valid user string.');
	}
	if (!isUniqueKcalStructure(reqBody)) {
		throw Error('Request does not contain a valid UniqueKcalStructure object.');
	}

	const data = await getStoredDataStructure(user);
	const kcal = data.kcal;
	if (kcal.length === 0) {
		throw Error('There is no data to update.');
	}

	const foundIndex = data.kcal.findIndex(k => k.id === reqBody.id);
	if (foundIndex === -1) {
		throw Error(`There is no kcal structure stored with the id '${reqBody.id}'.`);
	}

	Object.assign(data.kcal[foundIndex], reqBody);
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
	deleteKcal,
	updateKcal,
	handleGetAllKcalData,
	handleGetAllWeightData
};