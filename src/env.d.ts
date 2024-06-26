type KcalStructure = { what: string, date: string, kcal: string, comment: string };
type ExtendedKcalStructure = { what: string, date: string, time: string, kcal: string, comment: string };
type WeightStructure = { weight: string, waist: string, date: string };
type DataStructure = { kcal: KcalStructure[], weight: WeightStructure[], user: UserConfigStructure };
type KcalSummary = { todayKcal: number, lastMealTime: string, lastMealAgo: number, dailyKcalTarget: number,
    pastDailyKcal: DailyKcalAndTime[], expectedKcalHistorySum: number, actualKcalHistorySum: number, kcalHistorySumDifference: number };
type ReducedKcalStructure = { what: string, kcal: string };
type UserConfigStructure = { dailyKcalTarget: number, weightTarget: number, color: string, kcalHistoryCount: number, user: string };
type DailyKcalAndTime = { kcal: number, date: string };
type WeightTargetSummary = { weightTarget: number, twoKiloPrediction: string, oneKiloPrediction: string };