import { test, mock } from "node:test"
import assert from "assert/strict"
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
  createOrUpdateDataJson,
  loadWeightTarget,
  storeMultipleWeightInput,
} from "../controller"
import { readFile, rm, writeFile, mkdir } from "node:fs/promises"

test.describe("storing and loading data", () => {
  test.afterEach(async () => {
    await rm(__dirname + "/../data", { recursive: true })
    mock.timers.reset()
  })

  test("store kcal", async () => {
    const expect: DataStructure = {
      kcal: [
        {
          what: "test",
          kcal: "123",
          date: "2024-05-24T19:27",
          comment: "test",
        },
      ],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeKcalInput(expect.kcal[0])
    const result = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), result)
  })

  test("not store no kcal", async () => {
    const expect: DataStructure = {
      kcal: [
        {
          what: "test",
          kcal: "123",
          date: "2024-05-24T19:27",
          comment: "test",
        },
      ],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeKcalInput({ not: "kcal" } as unknown as KcalStructure)
    await storeKcalInput(expect.kcal[0])
    await storeKcalInput(null as unknown as KcalStructure)
    const result = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), result)
  })

  test("store multiple kcal", async () => {
    const expect: DataStructure = {
      kcal: [
        {
          what: "test",
          kcal: "123",
          date: "2024-05-24T19:27",
          comment: "test",
        },
        {
          what: "test9",
          kcal: "23",
          date: "2024-05-12T17:27",
          comment: "test",
        },
      ],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeMultipleKcalInput(expect.kcal)
    const result = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), result)
  })

  test("load all kcal", async () => {
    const expect: DataStructure = {
      kcal: [
        {
          what: "test",
          kcal: "123",
          date: "2024-05-24T19:27",
          comment: "test",
        },
        {
          what: "test2",
          kcal: "1234",
          date: "2024-05-24T09:27",
          comment: "test2",
        },
      ],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeKcalInput(expect.kcal[0])
    await storeKcalInput(expect.kcal[1])
    const resultStored = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored)
    const resultLoaded = await loadAllKcal()
    const expectLoaded: ExtendedKcalStructure[] = [
      { ...expect.kcal[1], date: "24.05.2024", time: "09:27" },
      { ...expect.kcal[0], date: "24.05.2024", time: "19:27" },
    ]
    assert.deepEqual(resultLoaded, expectLoaded)
  })

  test("load user configuration", async () => {
    const expect: DataStructure = {
      kcal: [],
      weight: [],
      user: { dailyKcalTarget: 1000, weightTarget: 80, color: "#ff0000", kcalHistoryCount: 3 },
    }
    await storeUserConfiguration(expect.user)
    const resultStored = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored)
    const resultLoaded = await loadUserConfiguration()
    assert.deepEqual(resultLoaded, expect.user)
  })

  test("store weight", async () => {
    const expect: DataStructure = {
      kcal: [],
      weight: [{ date: "2024-05-24", weight: "80", waist: "70" }],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeWeightInput(expect.weight[0])
    const result = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), result)
  })

  test("not store no weight", async () => {
    const expect: DataStructure = {
      kcal: [],
      weight: [{ date: "2024-05-24", weight: "80", waist: "70" }],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeWeightInput({ not: "weight" } as unknown as WeightStructure)
    await storeWeightInput(expect.weight[0])
    await storeWeightInput(null as unknown as WeightStructure)
    const result = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), result)
  })

  test("load all weight", async () => {
    const expect: DataStructure = {
      kcal: [],
      weight: [
        { date: "2024-05-24", weight: "80", waist: "70" },
        { date: "2024-05-04", weight: "85", waist: "75" },
      ],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeWeightInput(expect.weight[0])
    await storeWeightInput(expect.weight[1])
    const resultStored = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored)
    const resultLoaded = await loadAllWeight()
    const expectLoaded: WeightStructure[] = [
      { ...expect.weight[1], date: "04.05.2024" },
      { ...expect.weight[0], date: "24.05.2024" },
    ]
    assert.deepEqual(resultLoaded, expectLoaded)
  })

  test("load today kcal", async () => {
    const expect: DataStructure = {
      kcal: [
        { what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" },
        { what: "test3", kcal: "444", date: "2024-05-04T18:46", comment: "" },
        { what: "test2", kcal: "1234", date: "2024-05-24T09:27", comment: "" },
      ],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeMultipleKcalInput(expect.kcal)
    const resultStored = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored)

    // mock date
    mock.timers.enable({
      apis: ["Date"],
      now: new Date(2024, 4, 24, 22, 22, 0, 0).getTime(),
    })

    const resultLoaded = await loadTodayKcalSummary()
    const expectLoaded: KcalSummary = {
      todayKcal: 1357,
      lastMealTime: "19:27",
      lastMealAgo: 2,
      dailyKcalTarget: 2000,
      pastDailyKcal: [],
      actualKcalHistorySum: 0,
      expectedKcalHistorySum: 0,
      kcalHistorySumDifference: 0
    }
    assert.deepEqual(resultLoaded, expectLoaded)
  })

  test("load today kcal, different data set", async () => {
    const expect: DataStructure = {
      kcal: [
        {
          date: "2024-05-25T11:00",
          what: "test",
          kcal: "500",
          comment: "",
        },
        {
          date: "2024-05-25T16:48",
          what: "test",
          kcal: "150",
          comment: "",
        },
        {
          date: "2024-05-25T19:00",
          what: "test",
          kcal: "1500",
          comment: "",
        },
        {
          date: "2024-05-26T12:00",
          what: "test",
          kcal: "500",
          comment: "",
        },
        {
          date: "2024-05-26T14:53",
          what: "test",
          kcal: "100",
          comment: "",
        },
        {
          date: "2024-05-26T17:14",
          what: "test",
          kcal: "700",
          comment: "",
        },
        {
          date: "2024-05-26T18:04",
          what: "test",
          kcal: "360",
          comment: "",
        },
        {
          date: "2024-05-26T21:00",
          what: "test",
          kcal: "600",
          comment: "",
        },
        {
          date: "2024-05-27T09:48",
          what: "test",
          kcal: "550",
          comment: "",
        },
        {
          date: "2024-05-27T13:45",
          what: "test",
          kcal: "600",
          comment: "",
        },
        {
          date: "2024-05-27T17:30",
          what: "test",
          kcal: "600",
          comment: "",
        },
        {
          date: "2024-05-27T18:19",
          what: "test",
          kcal: "180",
          comment: "",
        },
        {
          date: "2024-05-28T10:00",
          what: "test",
          kcal: "500",
          comment: "",
        },
        {
          date: "2024-05-28T14:45",
          what: "test",
          kcal: "700",
          comment: "",
        },
        {
          date: "2024-05-28T14:48",
          what: "test",
          kcal: "100",
          comment: "",
        },
        {
          date: "2024-05-28T19:04",
          what: "test",
          kcal: "800",
          comment: "",
        },
      ],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeMultipleKcalInput(expect.kcal)
    const resultStored = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored)

    // mock date
    mock.timers.enable({
      apis: ["Date"],
      now: new Date(2024, 4, 28, 22, 22, 0, 0).getTime(),
    })

    const resultLoaded = await loadTodayKcalSummary()
    const expectLoaded: KcalSummary = {
      todayKcal: 2100,
      lastMealTime: "19:04",
      lastMealAgo: 3,
      dailyKcalTarget: 2000,
      pastDailyKcal: [
        { kcal: 1930, date: "27.05.2024" },
        { kcal: 2260, date: "26.05.2024" },
        { kcal: 2150, date: "25.05.2024" },
      ],
      actualKcalHistorySum: 6340,
      expectedKcalHistorySum: 6000,
      kcalHistorySumDifference: 340
    }
    assert.deepEqual(resultLoaded, expectLoaded)
  })

  test("load today kcal, between months", async () => {
    const expect: DataStructure = {
      kcal: [
        {
          date: "2024-05-30T10:00",
          what: "test",
          kcal: "500",
          comment: "",
        },
        {
          date: "2024-05-30T14:00",
          what: "test",
          kcal: "700",
          comment: "",
        },
        {
          date: "2024-05-30T18:13",
          what: "test",
          kcal: "600",
          comment: "",
        },
        {
          date: "2024-05-30T21:46",
          what: "test",
          kcal: "300",
          comment: "",
        },
        {
          date: "2024-05-31T11:00",
          what: "test",
          kcal: "700",
          comment: "",
        },
        {
          date: "2024-05-31T12:00",
          what: "test",
          kcal: "80",
          comment: "",
        },
        {
          date: "2024-05-31T14:48",
          what: "test",
          kcal: "450",
          comment: "",
        },
        {
          date: "2024-05-31T15:10",
          what: "test",
          kcal: "80",
          comment: "",
        },
        {
          date: "2024-05-31T21:34",
          what: "test",
          kcal: "600",
          comment: "",
        },
        {
          date: "2024-05-31T22:27",
          what: "test",
          kcal: "300",
          comment: "",
        },
        {
          date: "2024-06-01T11:30",
          what: "test",
          kcal: "500",
          comment: "",
        },
        {
          date: "2024-06-01T16:40",
          what: "test",
          kcal: "500",
          comment: "",
        },
        {
          date: "2024-06-01T21:12",
          what: "test",
          kcal: "700",
          comment: "",
        },
        {
          date: "2024-06-01T22:31",
          what: "test",
          kcal: "300",
          comment: "",
        },
        {
          date: "2024-06-01T00:05",
          what: "test",
          kcal: "80",
          comment: "",
        },
        {
          date: "2024-06-02T12:45",
          what: "test",
          kcal: "500",
          comment: "",
        },
        {
          date: "2024-06-02T14:13",
          what: "test",
          kcal: "150",
          comment: "",
        },
        {
          date: "2024-06-02T17:32",
          what: "test",
          kcal: "300",
          comment: "",
        },
        {
          date: "2024-06-02T18:20",
          what: "test",
          kcal: "600",
          comment: "",
        },
        {
          date: "2024-06-02T20:47",
          what: "test",
          kcal: "150",
          comment: "",
        },
      ],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 2 },
    }
    await storeMultipleKcalInput(expect.kcal)
    await storeUserConfiguration(expect.user)
    const resultStored = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored)

    // mock date
    mock.timers.enable({
      apis: ["Date"],
      now: new Date(2024, 5, 2, 22, 22, 0, 0).getTime(),
    })

    const resultLoaded = await loadTodayKcalSummary()
    const expectLoaded: KcalSummary = {
      todayKcal: 1700,
      lastMealTime: "20:47",
      lastMealAgo: 1,
      dailyKcalTarget: 2000,
      pastDailyKcal: [
        { kcal: 2080, date: "01.06.2024" },
        { kcal: 2210, date: "31.05.2024" },
      ],
      actualKcalHistorySum: 4290,
      expectedKcalHistorySum: 4000,
      kcalHistorySumDifference: 290
    }
    assert.deepEqual(resultLoaded, expectLoaded)
  })

  test("load all unique kcal input", async () => {
    const expect: DataStructure = {
      kcal: [
        { what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" },
        { what: "test3", kcal: "444", date: "2024-05-04T18:46", comment: "" },
        { what: "test2", kcal: "444", date: "2024-05-04T18:46", comment: "" },
        { what: "test4", kcal: "444", date: "2024-05-04T18:46", comment: "" },
        { what: "test", kcal: "200", date: "2024-05-04T18:46", comment: "" },
        { what: "test2", kcal: "444", date: "2024-05-14T18:46", comment: "" },
        { what: "test2", kcal: "1234", date: "2024-05-24T09:27", comment: "" },
      ],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeKcalInput(expect.kcal[0])
    await storeKcalInput(expect.kcal[1])
    await storeKcalInput(expect.kcal[2])
    await storeKcalInput(expect.kcal[3])
    await storeKcalInput(expect.kcal[4])
    await storeKcalInput(expect.kcal[5])
    await storeKcalInput(expect.kcal[6])

    const resultLoaded = await loadUniqueKcalInput()
    const expectLoaded: ReducedKcalStructure[] = [
      { what: "test", kcal: "123" },
      { what: "test2", kcal: "1234" },
      { what: "test3", kcal: "444" },
      { what: "test4", kcal: "444" },
    ]
    assert.deepEqual(resultLoaded, expectLoaded)
  })

  test("create data.json, if not available", async () => {
    let readFileResult = ""
    try {
      readFileResult = await readFile(__dirname + "/../data/data.json", {
        encoding: "utf-8",
      })
    } catch (e) {
      readFileResult = "file not available"
    }
    assert.deepEqual(readFileResult, "file not available")
    await createOrUpdateDataJson()
    try {
      readFileResult = await readFile(__dirname + "/../data/data.json", {
        encoding: "utf-8",
      })
    } catch (e) {
      readFileResult = "file not available"
    }
    assert.deepEqual(JSON.parse(readFileResult), {
      kcal: [],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    })
  })

  test("update data.json, if user variable is missing", async () => {
    const expectedContent = JSON.stringify({
      kcal: [
        { what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" },
      ],
      weight: [{ date: "2024-05-24", weight: "80", waist: "70" }],
    })
    await mkdir(__dirname + "/../data")
    await writeFile(__dirname + "/../data/data.json", expectedContent)
    let readFileResult = ""
    try {
      readFileResult = await readFile(__dirname + "/../data/data.json", {
        encoding: "utf-8",
      })
    } catch (e) {
      readFileResult = "file not available"
    }
    assert.deepEqual(readFileResult, expectedContent)
    await createOrUpdateDataJson()
    try {
      readFileResult = await readFile(__dirname + "/../data/data.json", {
        encoding: "utf-8",
      })
    } catch (e) {
      readFileResult = "file not available"
    }
    assert.deepEqual(JSON.parse(readFileResult), {
      kcal: [
        { what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" },
      ],
      weight: [{ date: "2024-05-24", weight: "80", waist: "70" }],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    })
  })

  test("create new data.json content, if data.json is available, but cannot be fixed", async () => {
    const expectedContent = JSON.stringify({ something: "else" })
    await mkdir(__dirname + "/../data")
    await writeFile(__dirname + "/../data/data.json", expectedContent)
    let readFileResult = ""
    try {
      readFileResult = await readFile(__dirname + "/../data/data.json", {
        encoding: "utf-8",
      })
    } catch (e) {
      readFileResult = "file not available"
    }
    assert.deepEqual(readFileResult, expectedContent)
    await createOrUpdateDataJson()
    try {
      readFileResult = await readFile(__dirname + "/../data/data.json", {
        encoding: "utf-8",
      })
    } catch (e) {
      readFileResult = "file not available"
    }
    assert.deepEqual(JSON.parse(readFileResult), {
      kcal: [],
      weight: [],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    })
  })

  test("update user config, if user config is incomplete", async () => {
    const expectedContent = JSON.stringify({
      kcal: [
        { what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" },
      ],
      weight: [{ date: "2024-05-24", weight: "80", waist: "70" }],
      user: { dailyKcalTarget: 2100 },
    })
    await mkdir(__dirname + "/../data")
    await writeFile(__dirname + "/../data/data.json", expectedContent)
    let readFileResult = ""
    try {
      readFileResult = await readFile(__dirname + "/../data/data.json", {
        encoding: "utf-8",
      })
    } catch (e) {
      readFileResult = "file not available"
    }
    assert.deepEqual(readFileResult, expectedContent)
    await createOrUpdateDataJson()
    try {
      readFileResult = await readFile(__dirname + "/../data/data.json", {
        encoding: "utf-8",
      })
    } catch (e) {
      readFileResult = "file not available"
    }
    assert.deepEqual(JSON.parse(readFileResult), {
      kcal: [
        { what: "test", kcal: "123", date: "2024-05-24T19:27", comment: "" },
      ],
      weight: [{ date: "2024-05-24", weight: "80", waist: "70" }],
      user: { dailyKcalTarget: 2100, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    })
  })

  test("load today kcal", async () => {
    const expect: DataStructure = {
      kcal: [],
      weight: [
        {
          date: "2024-04-07",
          weight: "115.8",
          waist: "114",
        },
        {
          date: "2024-04-21",
          weight: "114.1",
          waist: "113",
        },
        {
          date: "2024-05-07",
          weight: "112.9",
          waist: "112.5",
        },
        {
          date: "2024-05-21",
          weight: "111.9",
          waist: "112.5",
        },
        {
          date: "2024-06-07",
          weight: "111.5",
          waist: "112",
        },
      ],
      user: { dailyKcalTarget: 2000, weightTarget: 90, color: "#5f9ea0", kcalHistoryCount: 3 },
    }
    await storeMultipleWeightInput(expect.weight)
    const resultStored = await readFile(__dirname + "/../data/data.json", {
      encoding: "utf-8",
    })
    assert.deepEqual(JSON.stringify(expect, null, 2), resultStored)

    // mock date
    mock.timers.enable({
      apis: ["Date"],
      now: new Date(2024, 4, 24, 22, 22, 0, 0).getTime(),
    })

    const resultLoaded = await loadWeightTarget()
    const expectLoaded: WeightTargetSummary = {
      weightTarget: 90,
      oneKiloPrediction: "02.2026",
      twoKiloPrediction: "04.2025",
    }
    assert.deepEqual(resultLoaded, expectLoaded)
  })
})
