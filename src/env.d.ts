type KcalStructure = { what: string, date: string, kcal: string, comment: string };
type ExtendedKcalStructure = { what: string, date: string, time: string, kcal: string, comment: string };
type WeightStructure = { weight: string, date: string };
type DataStructure = { kcal: KcalStructure[], weight: WeightStructure[] };