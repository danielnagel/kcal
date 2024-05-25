import {test, mock} from "node:test";
import assert from "assert/strict";
import { loadAllKcal, loadAllWeight, loadTodayKcalSummary, storeKcalInput, storeWeightInput } from "../controller";
import { readFile, rm } from "node:fs/promises";

test.describe("storing and loading data", () => {

  test.afterEach(async () => {
    await rm(__dirname + "/../data", { recursive: true })
  })

  test('store kcal', async () => {
    const expect: DataStructure = { kcal: [{ what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "test" }], weight: [] };
    await storeKcalInput(expect.kcal[0]);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('not store no kcal', async () => {
    const expect: DataStructure = { kcal: [{ what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "test" }], weight: [] };
    await storeKcalInput({not: "kcal"} as unknown as KcalStructure);
    await storeKcalInput(expect.kcal[0]);
    await storeKcalInput(null as unknown as KcalStructure);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('load all kcal', async () => {
    const expect: DataStructure = { kcal: [{ what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "test" }, { what: "test2", kcal: "1234", date: "2024-05-24T09:27", comment: "test2" }], weight: [] };
    await storeKcalInput(expect.kcal[0]);
    await storeKcalInput(expect.kcal[1]);
    const resultStored = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);
    const resultLoaded = await loadAllKcal();
    const expectLoaded: ExtendedKcalStructure[] = [{ ...expect.kcal[1], date: "24.05.2024", time: "09:27" }, { ...expect.kcal[0], date: "24.05.2024", time: "19:27" }];
    assert.deepEqual(resultLoaded, expectLoaded)
  });

  test('store weight', async () => {
    const expect: DataStructure = { kcal: [], weight: [{ date: "2024-05-24", weight: "80", waist: "70" }] };
    await storeWeightInput(expect.weight[0]);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('not store no weight', async () => {
    const expect: DataStructure = { kcal: [], weight: [{ date: "2024-05-24", weight: "80", waist: "70" }] };
    await storeWeightInput({not: "weight"} as unknown as WeightStructure);
    await storeWeightInput(expect.weight[0]);
    await storeWeightInput(null as unknown as WeightStructure);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });

  test('load all weight', async () => {
    const expect: DataStructure = { kcal: [], weight: [{ date: "2024-05-24", weight: "80", waist: "70" }, { date: "2024-05-04", weight: "85", waist: "75" }] };
    await storeWeightInput(expect.weight[0]);
    await storeWeightInput(expect.weight[1]);
    const resultStored = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);
    const resultLoaded = await loadAllWeight();
    const expectLoaded: WeightStructure[] = [{ ...expect.weight[1], date: "04.05.2024"}, { ...expect.weight[0], date: "24.05.2024"}];
    assert.deepEqual(resultLoaded, expectLoaded)
  });

  test('load today kcal', async () => {
    const expect: DataStructure = { kcal: [{ what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" }, { what: "test3", kcal: "444", date: "2024-05-04T18:46", comment: "" }, { what: "test2", kcal: "1234", date: "2024-05-24T09:27", comment: "" }], weight: [] };
    await storeKcalInput(expect.kcal[0]);
    await storeKcalInput(expect.kcal[1]);
    await storeKcalInput(expect.kcal[2]);
    const resultStored = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored);

    // mock date
    mock.timers.enable({ apis: ['Date'], now: new Date(2024, 4, 24).getTime()});

    const resultLoaded = await loadTodayKcalSummary();
    const expectLoaded: KcalSummary = { kcal: 1357, date: "19:27"};
    assert.deepEqual(resultLoaded, expectLoaded)
  });

})