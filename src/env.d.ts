type KcalStructure = { what: string, date: string, kcal: string, comment: string };
type ExtendedKcalStructure = { what: string, date: string, time: string, kcal: string, comment: string };
type WeightStructure = { weight: string, waist: string, date: string };
type DataStructure = { kcal: KcalStructure[], weight: WeightStructure[], user: UserConfigStructure };
type KcalSummary = {kcal: number, date: string, ago: number, dailyKcalTarget: number};
type ReducedKcalStructure = { what: string, kcal: string };
type UserConfigStructure = {dailyKcalTarget: number};