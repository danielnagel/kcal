import { test } from "node:test"
import assert from "assert/strict"
import {
	isDataStructure,
	isKcalStructure,
	isWeightStructure,
	isUserConfigStructure,
} from "../typeguards"

test.describe("typeguards", () => {
	test("object is DataStructure", async () => {
		const expect: DataStructure = {
			kcal: [],
			weight: [],
			user: { dailyKcalTarget: 0, weightTarget: 0, color: "", kcalHistoryCount: 0, user: "" },
		}
		assert(isDataStructure(expect))
	})

	test("object is not DataStructure", async () => {
		assert(!isDataStructure({ something: "else" }))
	})

	test("null is not DataStructure", async () => {
		assert(!isDataStructure(null))
	})

	test("object is KcalStructure", async () => {
		const expect: KcalStructure = {
			what: "test",
			kcal: "123",
			date: "2024-05-24T19:27",
			comment: "test",
		}
		assert(isKcalStructure(expect))
	})

	test("object is not KcalStructure", async () => {
		assert(!isKcalStructure({ something: "else" }))
	})

	test("null is not KcalStructure", async () => {
		assert(!isKcalStructure(null))
	})

	test("object is WeightStructure", async () => {
		const expect: WeightStructure = {
			date: "2024-05-24",
			weight: "80",
			waist: "70",
		}
		assert(isWeightStructure(expect))
	})

	test("object is not WeightStructure", async () => {
		assert(!isWeightStructure({ something: "else" }))
	})

	test("null is not WeightStructure", async () => {
		assert(!isWeightStructure(null))
	})

	test("object is UserConfigStructure", async () => {
		const expect: UserConfigStructure = {
			dailyKcalTarget: 2000,
			weightTarget: 90,
			color: "",
			kcalHistoryCount: 0,
			user: ""
		}
		assert(isUserConfigStructure(expect))
	})

	test("object is not UserConfigStructure", async () => {
		assert(!isUserConfigStructure({ something: "else" }))
	})

	test("null is not UserConfigStructure", async () => {
		assert(!isUserConfigStructure(null))
	})
})
