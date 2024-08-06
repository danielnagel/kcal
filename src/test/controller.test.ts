import {
	test,
	mock 
} from 'node:test';
import assert from 'assert/strict';
import {
	loadAllKcal,
	loadAllWeight,
	loadTodayKcalSummary,
	storeKcalInput,
	storeMultipleKcalInput,
	storeWeightInput,
	loadUniqueKcalInput,
	storeUserConfiguration,
	loadUserConfiguration,
	loadWeightTarget,
	storeMultipleWeightInput,
	createUserJson,
	updateUserJson,
} from '../controller';
import {
	readFile,
	rm,
	writeFile,
	mkdir
} from 'node:fs/promises';
import {
	existsSync 
} from 'node:fs';
import {
	dataStructure1,
	dataStructure10,
	dataStructure2,
	dataStructure3,
	dataStructure4,
	dataStructure6, 
	dataStructure7, 
	dataStructure8, 
	dataStructure9, 
	defaultDataStructure,
	kcalInput1,
	kcalInput2,
	kcalInput3,
	kcalInput4,
	kcalInput5,
	kcalInput7,
	kcalInput9,
	weightInput10,
	weightInput6,
	weightInput8
} from './test.data';

test.describe('storing and loading data', () => {
	test.afterEach(async () => {
		if (existsSync(__dirname + '/../data')) {
			await rm(__dirname + '/../data', {
				recursive: true
			});
		}
		mock.timers.reset();
	});

	test('store kcal', async () => {
		await storeKcalInput(kcalInput3, 'test-user');
		const result = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure3, null, 2), result);
	});

	test('not store no kcal', async () => {
		await storeKcalInput({
			not: 'kcal' 
		} as unknown as KcalStructure, 'test-user');
		await storeKcalInput(null as unknown as KcalStructure, 'test-user');
		assert.equal(existsSync(__dirname + '/../data/test-user.json'), false);
	});

	test('store multiple kcal', async () => {
		await storeMultipleKcalInput(kcalInput1, 'test-user');
		const result = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure1, null, 2), result);
	});

	test('not store multiple kcal, if no array', async () => {
		await storeMultipleKcalInput('some bad requeste body' as unknown as KcalStructure[], 'test-user');
		assert.equal(existsSync(__dirname + '/../data/test-user.json'), false);
	});

	test('load all kcal', async () => {
		await storeMultipleKcalInput(kcalInput4, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure4, null, 2), resultStored);
		const resultLoaded = await loadAllKcal('test-user');
		const expectLoaded: ExtendedKcalStructure[] = [
			{
				...dataStructure4.kcal[1],
				date: '24.05.2024',
				time: '09:27' 
			},
			{
				...dataStructure4.kcal[0],
				date: '24.05.2024',
				time: '19:27' 
			},
		];
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('load all kcal, desc', async () => {
		await storeMultipleKcalInput(kcalInput4, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure4, null, 2), resultStored);
		const resultLoaded = await loadAllKcal('test-user', 'desc');
		const expectLoaded: ExtendedKcalStructure[] = [
			{
				...dataStructure4.kcal[0],
				date: '24.05.2024',
				time: '19:27' 
			},
			{
				...dataStructure4.kcal[1],
				date: '24.05.2024',
				time: '09:27' 
			},
		];
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('load all kcal, desc, with paging', async () => {
		await storeMultipleKcalInput(kcalInput7, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure7, null, 2), resultStored);
		const resultLoaded1 = await loadAllKcal('test-user', 'desc', 1, 3);
		const expectLoaded1: ExtendedKcalStructure[] = [
			{
				...dataStructure7.kcal[4],
				date: '18.07.2024',
				time: '06:00' 
			},
			{
				...dataStructure7.kcal[3],
				date: '17.07.2024',
				time: '19:07' 
			},
			{
				...dataStructure7.kcal[2],
				date: '17.07.2024',
				time: '18:24' 
			},
		];
		assert.deepEqual(resultLoaded1, expectLoaded1);
		const resultLoaded2 = await loadAllKcal('test-user', 'desc', 2, 3);
		const expectLoaded2: ExtendedKcalStructure[] = [
			{
				...dataStructure7.kcal[1],
				date: '17.07.2024',
				time: '13:00' 
			},
			{
				...dataStructure7.kcal[0],
				date: '17.07.2024',
				time: '06:00' 
			},
		];
		assert.deepEqual(resultLoaded2, expectLoaded2);
	});

	test('not store no user configuration', async () => {
		await storeUserConfiguration('bad request body' as unknown as UserConfigStructure, 'test-user');
		assert.equal(existsSync(__dirname + '/../data/test-user.json'), false);
	});

	test('load user configuration', async () => {
		const expect: DataStructure = {
			kcal: [],
			weight: [],
			user: {
				dailyKcalTarget: 1000,
				weightTarget: 80,
				color: '#ff0000',
				kcalHistoryCount: 3,
				user: 'test-user' 
			},
		};
		await storeUserConfiguration(expect.user, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);
		const resultLoaded = await loadUserConfiguration('test-user');
		assert.deepEqual(resultLoaded, expect.user);
	});

	test('load default user configuration, when there is no data', async () => {
		const resultLoaded = await loadUserConfiguration('test-user');
		const storedFile = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(defaultDataStructure, null, 2), storedFile);
		assert.deepEqual(resultLoaded, defaultDataStructure.user);
	});

	test('store weight', async () => {
		await storeWeightInput(weightInput10, 'test-user');
		const result = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure10, null, 2), result);
	});

	test('not store no weight', async () => {
		await storeWeightInput({
			not: 'weight' 
		} as unknown as WeightStructure, 'test-user');
		await storeWeightInput(null as unknown as WeightStructure, 'test-user');
		assert.equal(existsSync(__dirname + '/../data/test-user.json'), false);
	});

	test('not store multiple weight, if no array', async () => {
		await storeMultipleWeightInput('some bad requeste body' as unknown as WeightStructure[], 'test-user');
		assert.equal(existsSync(__dirname + '/../data/test-user.json'), false);
	});

	test('load all weight', async () => {
		await storeMultipleWeightInput(weightInput8, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure8, null, 2), resultStored);
		const resultLoaded = await loadAllWeight('test-user');
		const expectLoaded: WeightStructure[] = [
			{
				...dataStructure8.weight[1],
				date: '04.05.2024' 
			},
			{
				...dataStructure8.weight[0],
				date: '24.05.2024' 
			},
		];
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('load today kcal', async () => {
		await storeMultipleKcalInput(kcalInput9, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure9, null, 2), resultStored);

		// mock date
		mock.timers.enable({
			apis: ['Date'],
			now: new Date(2024, 4, 24, 22, 22, 0, 0).getTime(),
		});

		const resultLoaded = await loadTodayKcalSummary('test-user');
		const expectLoaded: KcalSummary = {
			todayKcal: 1357,
			lastMealTime: '19:27',
			lastMealAgo: 2,
			dailyKcalTarget: 2000,
			pastDailyKcal: [],
			actualKcalHistorySum: 0,
			expectedKcalHistorySum: 0,
			kcalHistorySumDifference: 0
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('load today kcal, different data set', async () => {
		await storeMultipleKcalInput(kcalInput1, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure1, null, 2), resultStored);

		// mock date
		mock.timers.enable({
			apis: ['Date'],
			now: new Date(2024, 4, 28, 22, 22, 0, 0).getTime(),
		});

		const resultLoaded = await loadTodayKcalSummary('test-user');
		const expectLoaded: KcalSummary = {
			todayKcal: 2100,
			lastMealTime: '19:04',
			lastMealAgo: 3,
			dailyKcalTarget: 2000,
			pastDailyKcal: [
				{
					kcal: 1930,
					date: '27.05.2024' 
				},
				{
					kcal: 2260,
					date: '26.05.2024' 
				},
				{
					kcal: 2150,
					date: '25.05.2024' 
				},
			],
			actualKcalHistorySum: 6340,
			expectedKcalHistorySum: 6000,
			kcalHistorySumDifference: 340
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('load today kcal, between months', async () => {
		await storeMultipleKcalInput(kcalInput2, 'test-user');
		await storeUserConfiguration(dataStructure2.user, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure2, null, 2), resultStored);

		// mock date
		mock.timers.enable({
			apis: ['Date'],
			now: new Date(2024, 5, 2, 22, 22, 0, 0).getTime(),
		});

		const resultLoaded = await loadTodayKcalSummary('test-user');
		const expectLoaded: KcalSummary = {
			todayKcal: 1700,
			lastMealTime: '20:47',
			lastMealAgo: 1,
			dailyKcalTarget: 2000,
			pastDailyKcal: [
				{
					kcal: 2080,
					date: '01.06.2024' 
				},
				{
					kcal: 2210,
					date: '31.05.2024' 
				},
			],
			actualKcalHistorySum: 4290,
			expectedKcalHistorySum: 4000,
			kcalHistorySumDifference: 290
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('load all unique kcal input', async () => {
		await storeMultipleKcalInput(kcalInput5, 'test-user');
		const resultLoaded = await loadUniqueKcalInput('test-user');
		const expectLoaded: ReducedKcalStructure[] = [
			{
				what: 'test',
				kcal: '123' 
			},
			{
				what: 'test2',
				kcal: '1234' 
			},
			{
				what: 'test3',
				kcal: '444' 
			},
			{
				what: 'test4',
				kcal: '444' 
			},
		];
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('load weight summary', async () => {
		await storeMultipleWeightInput(weightInput6, 'test-user');
		const resultStored = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(dataStructure6, null, 2), resultStored);

		// mock date
		mock.timers.enable({
			apis: ['Date'],
			now: new Date(2024, 4, 24, 22, 22, 0, 0).getTime(),
		});

		const resultLoaded = await loadWeightTarget('test-user');
		const expectLoaded: WeightTargetSummary = {
			weightTarget: 90,
			oneKiloPrediction: '02.2026',
			twoKiloPrediction: '04.2025',
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('default weight summary, when there are no weights', async () => {
		await mkdir(`${__dirname}/../data`);
		await writeFile(`${__dirname}/../data/test-user.json`, JSON.stringify(defaultDataStructure, null, 2));
		const resultLoaded = await loadWeightTarget('test-user');
		const expectLoaded: WeightTargetSummary = {
			weightTarget: 0,
			oneKiloPrediction: '',
			twoKiloPrediction: '',
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test('create test-user.json', async () => {
		assert.equal(existsSync(__dirname + '/../data/test-user.json'), false);
		const result = await createUserJson('test-user');
		assert.deepEqual(defaultDataStructure, result);
		assert.equal(existsSync(__dirname + '/../data/test-user.json'), true);
		const storedFile = await readFile(__dirname + '/../data/test-user.json', {
			encoding: 'utf-8',
		});
		assert.deepEqual(JSON.stringify(defaultDataStructure, null, 2), storedFile);
	});

	test('not create test-user.json, when user string is not valid', async () => {
		await createUserJson(null as unknown as string);
		assert.equal(existsSync(__dirname + '/../data/null.json'), false);
		await createUserJson(undefined as unknown as string);
		assert.equal(existsSync(__dirname + '/../data/undefined.json'), false);
		await createUserJson('');
		assert.equal(existsSync(__dirname + '/../data/.json'), false);
	});

	test('update test-user.json to user-test.json', async () => {
		await mkdir(`${__dirname}/../data`);
		await writeFile(`${__dirname}/../data/test-user.json`, JSON.stringify(defaultDataStructure, null, 2));
		await updateUserJson('test-user', 'user-test');
		assert.equal(existsSync(`${__dirname}/../data/test-user.json`), false);
		assert.equal(existsSync(`${__dirname}/../data/user-test.json`), true);
		const storedFile = await readFile(__dirname + '/../data/user-test.json', {
			encoding: 'utf-8',
		});
		defaultDataStructure.user.user = 'user-test';
		assert.deepEqual(JSON.stringify(defaultDataStructure, null, 2), storedFile);
	});

	test('not update test-user.json, when there is no test-user.json', async () => {
		assert.equal(existsSync(`${__dirname}/../data/test-user.json`), false);
		await updateUserJson('test-user', 'user-test');
		assert.equal(existsSync(`${__dirname}/../data/test-user.json`), false);
		assert.equal(existsSync(`${__dirname}/../data/user-test.json`), false);
	});

	test('not update test-user.json, when newUser string is not valid', async () => {
		await mkdir(`${__dirname}/../data`);
		await writeFile(`${__dirname}/../data/test-user.json`, JSON.stringify(defaultDataStructure, null, 2));
		await updateUserJson('test-user', null as unknown as string);
		assert.equal(existsSync(`${__dirname}/../data/null.json`), false);
		await updateUserJson('test-user', undefined as unknown as string);
		assert.equal(existsSync(`${__dirname}/../data/undefined.json`), false);
		await updateUserJson('test-user', '');
		assert.equal(existsSync(`${__dirname}/../data/.json`), false);
	});
});
