type KcalStructure = { what: string, date: string, kcal: string, comment: string };
type UniqueKcalStructure = {id: number} & KcalStructure;
type ExtendedKcalStructure = { id: number, what: string, date: string, time: string, kcal: string, comment: string };
type WeightStructure = { weight: string, waist: string, date: string };
type UniqueWeightStructure = {id: number} & WeightStructure;
type DataStructure = { kcal: UniqueKcalStructure[], weight: UniqueWeightStructure[], user: UserConfigStructure };
type KcalSummary = { todayKcal: number, lastMealTime: string, lastMealAgo: number, dailyKcalTarget: number,
    pastDailyKcal: DailyKcalAndTime[], expectedKcalHistorySum: number, actualKcalHistorySum: number, kcalHistorySumDifference: number };
type ReducedKcalStructure = { what: string, kcal: string };
type UserConfigStructure = { dailyKcalTarget: number, weightTarget: number, color: string, kcalHistoryCount: number, user: string };
type DailyKcalAndTime = { kcal: number, date: string };
type WeightTargetSummary = { weightTarget: number, twoKiloPrediction: string, oneKiloPrediction: string };
type LoadKcalParameters = {user?: string, range?: string, select?: string, order?: string, page?: string};