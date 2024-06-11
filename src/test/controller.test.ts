import { test, mock } from "node:test";
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
  loadUserConfiguration
} from "../controller";
import { readFile, rm } from "node:fs/promises";

test.describe("storing and loading data", () => {

  test.afterEach(async () => {
    await rm(__dirname + "/../data", { recursive: true })
  })

  test('store kcal', async () => {
    const expect: DataStructure = { kcal: [{ what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "test" }], weight: [], user: { dailyKcalTarget: 2000 } };
    await storeKcalInput(expect.kcal[0]);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('not store no kcal', async () => {
    const expect: DataStructure = { kcal: [{ what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "test" }], weight: [], user: { dailyKcalTarget: 2000 } };
    await storeKcalInput({ not: "kcal" } as unknown as KcalStructure);
    await storeKcalInput(expect.kcal[0]);
    await storeKcalInput(null as unknown as KcalStructure);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('store multiple kcal', async () => {
    const expect: DataStructure = { kcal: [{ what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "test" }, { what: "test9", kcal: "23", date: "2024-05-12T17:27", comment: "test" }], weight: [], user: { dailyKcalTarget: 2000 } };
    await storeMultipleKcalInput(expect.kcal);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('load all kcal', async () => {
    const expect: DataStructure = { kcal: [{ what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "test" }, { what: "test2", kcal: "1234", date: "2024-05-24T09:27", comment: "test2" }], weight: [], user: { dailyKcalTarget: 2000 } };
    await storeKcalInput(expect.kcal[0]);
    await storeKcalInput(expect.kcal[1]);
    const resultStored = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);
    const resultLoaded = await loadAllKcal();
    const expectLoaded: ExtendedKcalStructure[] = [{ ...expect.kcal[1], date: "24.05.2024", time: "09:27" }, { ...expect.kcal[0], date: "24.05.2024", time: "19:27" }];
    assert.deepEqual(resultLoaded, expectLoaded)
  });

  test('load user configuration', async () => {
    const expect: DataStructure = { kcal: [], weight: [], user: { dailyKcalTarget: 1000 } };
    await storeUserConfiguration(expect.user);
    const resultStored = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);
    const resultLoaded = await loadUserConfiguration();
    assert.deepEqual(resultLoaded, expect.user);
  });

  test('store weight', async () => {
    const expect: DataStructure = { kcal: [], weight: [{ date: "2024-05-24", weight: "80", waist: "70" }], user: { dailyKcalTarget: 2000 } };
    await storeWeightInput(expect.weight[0]);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('not store no weight', async () => {
    const expect: DataStructure = { kcal: [], weight: [{ date: "2024-05-24", weight: "80", waist: "70" }], user: { dailyKcalTarget: 2000 } };
    await storeWeightInput({ not: "weight" } as unknown as WeightStructure);
    await storeWeightInput(expect.weight[0]);
    await storeWeightInput(null as unknown as WeightStructure);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('load all weight', async () => {
    const expect: DataStructure = { kcal: [], weight: [{ date: "2024-05-24", weight: "80", waist: "70" }, { date: "2024-05-04", weight: "85", waist: "75" }], user: { dailyKcalTarget: 2000 } };
    await storeWeightInput(expect.weight[0]);
    await storeWeightInput(expect.weight[1]);
    const resultStored = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);
    const resultLoaded = await loadAllWeight();
    const expectLoaded: WeightStructure[] = [{ ...expect.weight[1], date: "04.05.2024" }, { ...expect.weight[0], date: "24.05.2024" }];
    assert.deepEqual(resultLoaded, expectLoaded)
  });

  test('load today kcal', async () => {
    const expect: DataStructure = {
      kcal: [
        { what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" },
        { what: "test3", kcal: "444", date: "2024-05-04T18:46", comment: "" },
        { what: "test2", kcal: "1234", date: "2024-05-24T09:27", comment: "" }
      ], weight: [], user: { dailyKcalTarget: 2000 }
    };
    await storeKcalInput(expect.kcal[0]);
    await storeKcalInput(expect.kcal[1]);
    await storeKcalInput(expect.kcal[2]);
    const resultStored = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);

    // mock date
    mock.timers.enable({ apis: ['Date'], now: new Date(2024, 4, 24, 22, 22, 0, 0).getTime() });

    const resultLoaded = await loadTodayKcalSummary();
    const expectLoaded: KcalSummary = { kcal: 1357, date: "19:27", ago: 2, dailyKcalTarget: 2000 };
    assert.deepEqual(resultLoaded, expectLoaded)
  });

  test('load all unique kcal input', async () => {
    const expect: DataStructure = {
      kcal: [
        { what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" },
        { what: "test3", kcal: "444", date: "2024-05-04T18:46", comment: "" },
        { what: "test2", kcal: "444", date: "2024-05-04T18:46", comment: "" },
        { what: "test4", kcal: "444", date: "2024-05-04T18:46", comment: "" },
        { what: "test", kcal: "200", date: "2024-05-04T18:46", comment: "" },
        { what: "test2", kcal: "444", date: "2024-05-14T18:46", comment: "" },
        { what: "test2", kcal: "1234", date: "2024-05-24T09:27", comment: "" }
      ], weight: [], user: { dailyKcalTarget: 2000 }
    };
    await storeKcalInput(expect.kcal[0]);
    await storeKcalInput(expect.kcal[1]);
    await storeKcalInput(expect.kcal[2]);
    await storeKcalInput(expect.kcal[3]);
    await storeKcalInput(expect.kcal[4]);
    await storeKcalInput(expect.kcal[5]);
    await storeKcalInput(expect.kcal[6]);

    const resultLoaded = await loadUniqueKcalInput();
    const expectLoaded: ReducedKcalStructure[] = [
      { what: "test", kcal: "123" },
      { what: "test2", kcal: "1234" },
      { what: "test3", kcal: "444" },
      { what: "test4", kcal: "444" },
    ];
    assert.deepEqual(resultLoaded, expectLoaded)
  })

})