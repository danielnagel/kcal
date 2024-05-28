type KcalStructure = { what: string, date: string, kcal: string, comment: string };
type ExtendedKcalStructure = { what: string, date: string, time: string, kcal: string, comment: string };
type WeightStructure = { weight: string, waist: string, date: string };
type DataStructure = { kcal: KcalStructure[], weight: WeightStructure[] };
type KcalSummary = {kcal: number, date: string};
type ReducedKcalStructure = { what: string, kcal: string };