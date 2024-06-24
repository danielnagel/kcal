export const isDataStructure = (data: unknown): data is DataStructure => {
	return (
		data !== null && data !== undefined &&
    Array.isArray((data as DataStructure).kcal) &&
    Array.isArray((data as DataStructure).weight) &&
    typeof (data as DataStructure).user !== "undefined"
	);
};

export const isKcalStructure = (data: unknown): data is KcalStructure => {
	return (
		data !== null && data !== undefined &&
    typeof (data as KcalStructure).kcal !== "undefined" &&
    typeof (data as KcalStructure).what !== "undefined" &&
    typeof (data as KcalStructure).date !== "undefined"
	);
};

export const isWeightStructure = (data: unknown): data is WeightStructure => {
	return (
		data !== null && data !== undefined &&
    typeof (data as WeightStructure).waist !== "undefined" &&
    typeof (data as WeightStructure).weight !== "undefined" &&
    typeof (data as WeightStructure).date !== "undefined"
	);
};

export const isUserConfigStructure = (
	data: unknown
): data is UserConfigStructure => {
	return (
		data !== null && data !== undefined &&
    typeof (data as UserConfigStructure).dailyKcalTarget !== "undefined" &&
    typeof (data as UserConfigStructure).weightTarget !== "undefined" &&
    typeof (data as UserConfigStructure).color !== "undefined" &&
    typeof (data as UserConfigStructure).kcalHistoryCount !== "undefined"
	);
};
