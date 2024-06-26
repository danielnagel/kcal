import {
	test,
	mock 
} from "node:test";
import assert from "assert/strict";
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
} from "../controller";
import {
	readFile,
	rm,
	writeFile,
	mkdir
} from "node:fs/promises";
import {
	existsSync 
} from "node:fs";
import {
	dataStructure1,
	dataStructure2,
	dataStructure3,
	dataStructure4,
	dataStructure5,
	dataStructure6, 
	defaultDataStructure
} from "./test.data";

test.describe("storing and loading data", () => {
	test.afterEach(async () => {
		if(existsSync(__dirname + "/../data")) {
			await rm(__dirname + "/../data", {
				recursive: true
			});
		}
		mock.timers.reset();
	});

	test("store kcal", async () => {
		await storeKcalInput(dataStructure3.kcal[0], "test-user");
		const result = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(dataStructure3, null, 2), result);
	});

	test("not store no kcal", async () => {
		await storeKcalInput({
			not: "kcal" 
		} as unknown as KcalStructure, "test-user");
		await storeKcalInput(null as unknown as KcalStructure, "test-user");
		assert.equal(existsSync(__dirname + "/../data/test-user.json"), false);
	});

	test("store multiple kcal", async () => {
		await storeMultipleKcalInput(dataStructure1.kcal, "test-user");
		const result = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(dataStructure1, null, 2), result);
	});

	test("not store multiple kcal, if no array", async () => {
		await storeMultipleKcalInput("some bad requeste body" as unknown as KcalStructure[], "test-user");
		assert.equal(existsSync(__dirname + "/../data/test-user.json"), false);
	});

	test("load all kcal", async () => {
		await storeMultipleKcalInput(dataStructure4.kcal, "test-user");
		const resultStored = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(dataStructure4, null, 2), resultStored);
		const resultLoaded = await loadAllKcal("test-user");
		const expectLoaded: ExtendedKcalStructure[] = [
			{
				...dataStructure4.kcal[1],
				date: "24.05.2024",
				time: "09:27" 
			},
			{
				...dataStructure4.kcal[0],
				date: "24.05.2024",
				time: "19:27" 
			},
		];
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test("not store no user configuration", async () => {
		await storeUserConfiguration("bad request body" as unknown as UserConfigStructure, "test-user");
		assert.equal(existsSync(__dirname + "/../data/test-user.json"), false);
	});

	test("load user configuration", async () => {
		const expect: DataStructure = {
			kcal: [],
			weight: [],
			user: {
				dailyKcalTarget: 1000,
				weightTarget: 80,
				color: "#ff0000",
				kcalHistoryCount: 3,
				user: "test-user" 
			},
		};
		await storeUserConfiguration(expect.user, "test-user");
		const resultStored = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);
		const resultLoaded = await loadUserConfiguration("test-user");
		assert.deepEqual(resultLoaded, expect.user);
	});

	test("load default user configuration, when there is no data", async () => {
		const resultLoaded = await loadUserConfiguration("test-user");
		const storedFile = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(defaultDataStructure, null, 2), storedFile);
		assert.deepEqual(resultLoaded, defaultDataStructure.user);
	});

	test("store weight", async () => {
		const expect: DataStructure = {
			kcal: [],
			weight: [{
				date: "2024-05-24",
				weight: "80",
				waist: "70" 
			}],
			user: {
				dailyKcalTarget: 2000,
				weightTarget: 90,
				color: "#5f9ea0",
				kcalHistoryCount: 3,
				user: "test-user" 
			},
		};
		await storeWeightInput(expect.weight[0], "test-user");
		const result = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(expect, null, 2), result);
	});

	test("not store no weight", async () => {
		await storeWeightInput({
			not: "weight" 
		} as unknown as WeightStructure, "test-user");
		await storeWeightInput(null as unknown as WeightStructure, "test-user");
		assert.equal(existsSync(__dirname + "/../data/test-user.json"), false);
	});

	test("not store multiple weight, if no array", async () => {
		await storeMultipleWeightInput("some bad requeste body" as unknown as WeightStructure[], "test-user");
		assert.equal(existsSync(__dirname + "/../data/test-user.json"), false);
	});

	test("load all weight", async () => {
		const expect: DataStructure = {
			kcal: [],
			weight: [
				{
					date: "2024-05-24",
					weight: "80",
					waist: "70" 
				},
				{
					date: "2024-05-04",
					weight: "85",
					waist: "75" 
				},
			],
			user: {
				dailyKcalTarget: 2000,
				weightTarget: 90,
				color: "#5f9ea0",
				kcalHistoryCount: 3,
				user: "test-user" 
			},
		};
		await storeMultipleWeightInput(expect.weight, "test-user");
		const resultStored = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);
		const resultLoaded = await loadAllWeight("test-user");
		const expectLoaded: WeightStructure[] = [
			{
				...expect.weight[1],
				date: "04.05.2024" 
			},
			{
				...expect.weight[0],
				date: "24.05.2024" 
			},
		];
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test("load today kcal", async () => {
		const expect: DataStructure = {
			kcal: [
				{
					what: "test",
					kcal: "123",
					date: "2024-05-24T19:27",
					comment: "" 
				},
				{
					what: "test3",
					kcal: "444",
					date: "2024-05-04T18:46",
					comment: "" 
				},
				{
					what: "test2",
					kcal: "1234",
					date: "2024-05-24T09:27",
					comment: "" 
				},
			],
			weight: [],
			user: {
				dailyKcalTarget: 2000,
				weightTarget: 90,
				color: "#5f9ea0",
				kcalHistoryCount: 3,
				user: "test-user" 
			},
		};
		await storeMultipleKcalInput(expect.kcal, "test-user");
		const resultStored = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);

		// mock date
		mock.timers.enable({
			apis: ["Date"],
			now: new Date(2024, 4, 24, 22, 22, 0, 0).getTime(),
		});

		const resultLoaded = await loadTodayKcalSummary("test-user");
		const expectLoaded: KcalSummary = {
			todayKcal: 1357,
			lastMealTime: "19:27",
			lastMealAgo: 2,
			dailyKcalTarget: 2000,
			pastDailyKcal: [],
			actualKcalHistorySum: 0,
			expectedKcalHistorySum: 0,
			kcalHistorySumDifference: 0
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test("load today kcal, different data set", async () => {
		await storeMultipleKcalInput(dataStructure1.kcal, "test-user");
		const resultStored = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(dataStructure1, null, 2), resultStored);

		// mock date
		mock.timers.enable({
			apis: ["Date"],
			now: new Date(2024, 4, 28, 22, 22, 0, 0).getTime(),
		});

		const resultLoaded = await loadTodayKcalSummary("test-user");
		const expectLoaded: KcalSummary = {
			todayKcal: 2100,
			lastMealTime: "19:04",
			lastMealAgo: 3,
			dailyKcalTarget: 2000,
			pastDailyKcal: [
				{
					kcal: 1930,
					date: "27.05.2024" 
				},
				{
					kcal: 2260,
					date: "26.05.2024" 
				},
				{
					kcal: 2150,
					date: "25.05.2024" 
				},
			],
			actualKcalHistorySum: 6340,
			expectedKcalHistorySum: 6000,
			kcalHistorySumDifference: 340
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test("load today kcal, between months", async () => {
		await storeMultipleKcalInput(dataStructure2.kcal, "test-user");
		await storeUserConfiguration(dataStructure2.user, "test-user");
		const resultStored = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(dataStructure2, null, 2), resultStored);

		// mock date
		mock.timers.enable({
			apis: ["Date"],
			now: new Date(2024, 5, 2, 22, 22, 0, 0).getTime(),
		});

		const resultLoaded = await loadTodayKcalSummary("test-user");
		const expectLoaded: KcalSummary = {
			todayKcal: 1700,
			lastMealTime: "20:47",
			lastMealAgo: 1,
			dailyKcalTarget: 2000,
			pastDailyKcal: [
				{
					kcal: 2080,
					date: "01.06.2024" 
				},
				{
					kcal: 2210,
					date: "31.05.2024" 
				},
			],
			actualKcalHistorySum: 4290,
			expectedKcalHistorySum: 4000,
			kcalHistorySumDifference: 290
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test("load all unique kcal input", async () => {
		await storeMultipleKcalInput(dataStructure5.kcal, "test-user");
		const resultLoaded = await loadUniqueKcalInput("test-user");
		const expectLoaded: ReducedKcalStructure[] = [
			{
				what: "test",
				kcal: "123" 
			},
			{
				what: "test2",
				kcal: "1234" 
			},
			{
				what: "test3",
				kcal: "444" 
			},
			{
				what: "test4",
				kcal: "444" 
			},
		];
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test("load weight summary", async () => {
		await storeMultipleWeightInput(dataStructure6.weight, "test-user");
		const resultStored = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(dataStructure6, null, 2), resultStored);

		// mock date
		mock.timers.enable({
			apis: ["Date"],
			now: new Date(2024, 4, 24, 22, 22, 0, 0).getTime(),
		});

		const resultLoaded = await loadWeightTarget("test-user");
		const expectLoaded: WeightTargetSummary = {
			weightTarget: 90,
			oneKiloPrediction: "02.2026",
			twoKiloPrediction: "04.2025",
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test("default weight summary, when there are no weights", async () => {
		await mkdir(`${__dirname}/../data`);
		await writeFile(`${__dirname}/../data/test-user.json`, JSON.stringify(defaultDataStructure, null, 2));
		const resultLoaded = await loadWeightTarget("test-user");
		const expectLoaded: WeightTargetSummary = {
			weightTarget: 0,
			oneKiloPrediction: "",
			twoKiloPrediction: "",
		};
		assert.deepEqual(resultLoaded, expectLoaded);
	});

	test("create test-user.json", async () => {
		assert.equal(existsSync(__dirname + "/../data/test-user.json"), false);
		const result = await createUserJson("test-user");
		assert.deepEqual(defaultDataStructure, result);
		assert.equal(existsSync(__dirname + "/../data/test-user.json"), true);
		const storedFile = await readFile(__dirname + "/../data/test-user.json", {
			encoding: "utf-8",
		});
		assert.deepEqual(JSON.stringify(defaultDataStructure, null, 2), storedFile);
	});

	test("not create test-user.json, when user string is not valid", async () => {
		await createUserJson(null as unknown as string);
		assert.equal(existsSync(__dirname + "/../data/null.json"), false);
		await createUserJson(undefined as unknown as string);
		assert.equal(existsSync(__dirname + "/../data/undefined.json"), false);
		await createUserJson("");
		assert.equal(existsSync(__dirname + "/../data/.json"), false);
	});

	test("update test-user.json to user-test.json", async () => {
		await mkdir(`${__dirname}/../data`);
		await writeFile(`${__dirname}/../data/test-user.json`, JSON.stringify(defaultDataStructure, null, 2));
		await updateUserJson("test-user", "user-test");
		assert.equal(existsSync(`${__dirname}/../data/test-user.json`), false);
		assert.equal(existsSync(`${__dirname}/../data/user-test.json`), true);
		const storedFile = await readFile(__dirname + "/../data/user-test.json", {
			encoding: "utf-8",
		});
		defaultDataStructure.user.user = "user-test";
		assert.deepEqual(JSON.stringify(defaultDataStructure, null, 2), storedFile);
	});

	test("not update test-user.json, when there is no test-user.json", async () => {
		assert.equal(existsSync(`${__dirname}/../data/test-user.json`), false);
		await updateUserJson("test-user", "user-test");
		assert.equal(existsSync(`${__dirname}/../data/test-user.json`), false);
		assert.equal(existsSync(`${__dirname}/../data/user-test.json`), false);
	});

	test("not update test-user.json, when newUser string is not valid", async () => {
		await mkdir(`${__dirname}/../data`);
		await writeFile(`${__dirname}/../data/test-user.json`, JSON.stringify(defaultDataStructure, null, 2));
		await updateUserJson("test-user", null as unknown as string);
		assert.equal(existsSync(`${__dirname}/../data/null.json`), false);
		await updateUserJson("test-user", undefined as unknown as string);
		assert.equal(existsSync(`${__dirname}/../data/undefined.json`), false);
		await updateUserJson("test-user", "");
		assert.equal(existsSync(`${__dirname}/../data/.json`), false);
	});
});
