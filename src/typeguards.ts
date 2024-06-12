export const isDataStructure = (data: any): data is DataStructure => {
  return (
    data &&
    Array.isArray((data as DataStructure).kcal) &&
    Array.isArray((data as DataStructure).weight) &&
    typeof (data as DataStructure).user !== "undefined"
  )
}

export const isKcalStructure = (data: any): data is KcalStructure => {
  return (
    data &&
    typeof (data as KcalStructure).kcal !== "undefined" &&
    typeof (data as KcalStructure).what !== "undefined" &&
    typeof (data as KcalStructure).date !== "undefined"
  )
}

export const isWeightStructure = (data: any): data is WeightStructure => {
  return (
    data &&
    typeof (data as WeightStructure).waist !== "undefined" &&
    typeof (data as WeightStructure).weight !== "undefined" &&
    typeof (data as WeightStructure).date !== "undefined"
  )
}

export const isUserConfigStructure = (
  data: any
): data is UserConfigStructure => {
  return (
    data &&
    typeof (data as UserConfigStructure).dailyKcalTarget !== "undefined" &&
    typeof (data as UserConfigStructure).weightTarget !== "undefined"
  )
}
