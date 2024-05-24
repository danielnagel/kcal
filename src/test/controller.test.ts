import test from "node:test";
import assert from "assert/strict";
import {storeKcalInput} from "../controller";
import { readFile, rm } from "node:fs/promises";

test.describe("storing and loading data", () => {

  test.afterEach(async () => {
    await rm(__dirname + "/../data", {recursive: true})
  })

  test('store kcal', async (t) => {
    const expect: DataStructure = {kcal: [{what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "test"}], weight: []};
    await storeKcalInput(expect.kcal[0]);
    const result = await readFile(__dirname + "/../data/data.json", { encoding: 'utf-8' });
    assert.deepEqual(JSON.stringify(expect, null, 2), result);
  });
})