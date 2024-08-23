export const defaultDataStructure: DataStructure = {
	kcal: [],
	weight: [],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 3,
		user: 'test-user'
	}
};

export const dataStructure1: DataStructure = {
	kcal: [
		{
			date: '2024-05-25T11:00',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 0
		},
		{
			date: '2024-05-25T16:48',
			what: 'test',
			kcal: '150',
			comment: '',
			id: 1
		},
		{
			date: '2024-05-25T19:00',
			what: 'test',
			kcal: '1500',
			comment: '',
			id: 2
		},
		{
			date: '2024-05-26T12:00',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 3
		},
		{
			date: '2024-05-26T14:53',
			what: 'test',
			kcal: '100',
			comment: '',
			id: 4
		},
		{
			date: '2024-05-26T17:14',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 5
		},
		{
			date: '2024-05-26T18:04',
			what: 'test',
			kcal: '360',
			comment: '',
			id: 6
		},
		{
			date: '2024-05-26T21:00',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 7
		},
		{
			date: '2024-05-27T09:48',
			what: 'test',
			kcal: '550',
			comment: '',
			id: 8
		},
		{
			date: '2024-05-27T13:45',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 9
		},
		{
			date: '2024-05-27T17:30',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 10
		},
		{
			date: '2024-05-27T18:19',
			what: 'test',
			kcal: '180',
			comment: '',
			id: 11
		},
		{
			date: '2024-05-28T10:00',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 12
		},
		{
			date: '2024-05-28T14:45',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 13
		},
		{
			date: '2024-05-28T14:48',
			what: 'test',
			kcal: '100',
			comment: '',
			id: 14
		},
		{
			date: '2024-05-28T19:04',
			what: 'test',
			kcal: '800',
			comment: '',
			id: 15
		}
	],
	weight: [],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 3,
		user: 'test-user'
	}
};

export const kcalInput1: KcalStructure[] = [
	{
		date: '2024-05-25T11:00',
		what: 'test',
		kcal: '500',
		comment: '',
	},
	{
		date: '2024-05-25T16:48',
		what: 'test',
		kcal: '150',
		comment: '',
	},
	{
		date: '2024-05-25T19:00',
		what: 'test',
		kcal: '1500',
		comment: '',
	},
	{
		date: '2024-05-26T12:00',
		what: 'test',
		kcal: '500',
		comment: '',
	},
	{
		date: '2024-05-26T14:53',
		what: 'test',
		kcal: '100',
		comment: '',
	},
	{
		date: '2024-05-26T17:14',
		what: 'test',
		kcal: '700',
		comment: '',
	},
	{
		date: '2024-05-26T18:04',
		what: 'test',
		kcal: '360',
		comment: '',
	},
	{
		date: '2024-05-26T21:00',
		what: 'test',
		kcal: '600',
		comment: '',
	},
	{
		date: '2024-05-27T09:48',
		what: 'test',
		kcal: '550',
		comment: '',
	},
	{
		date: '2024-05-27T13:45',
		what: 'test',
		kcal: '600',
		comment: '',
	},
	{
		date: '2024-05-27T17:30',
		what: 'test',
		kcal: '600',
		comment: '',
	},
	{
		date: '2024-05-27T18:19',
		what: 'test',
		kcal: '180',
		comment: '',
	},
	{
		date: '2024-05-28T10:00',
		what: 'test',
		kcal: '500',
		comment: '',
	},
	{
		date: '2024-05-28T14:45',
		what: 'test',
		kcal: '700',
		comment: '',
	},
	{
		date: '2024-05-28T14:48',
		what: 'test',
		kcal: '100',
		comment: '',
	},
	{
		date: '2024-05-28T19:04',
		what: 'test',
		kcal: '800',
		comment: '',
	}
];

export const groupedDataStructure1: GroupedKcalStructure = {
	'25.05.2024': [
	  {
			date: '25.05.2024',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 0,
			time: '11:00'
	  },
	  {
			date: '25.05.2024',
			what: 'test',
			kcal: '150',
			comment: '',
			id: 1,
			time: '16:48'
	  },
	  {
			date: '25.05.2024',
			what: 'test',
			kcal: '1500',
			comment: '',
			id: 2,
			time: '19:00'
	  }
	],
	'26.05.2024': [
	  {
			date: '26.05.2024',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 3,
			time: '12:00'
	  },
	  {
			date: '26.05.2024',
			what: 'test',
			kcal: '100',
			comment: '',
			id: 4,
			time: '14:53'
	  },
	  {
			date: '26.05.2024',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 5,
			time: '17:14'
	  },
	  {
			date: '26.05.2024',
			what: 'test',
			kcal: '360',
			comment: '',
			id: 6,
			time: '18:04'
	  },
	  {
			date: '26.05.2024',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 7,
			time: '21:00'
	  }
	],
	'27.05.2024': [
	  {
			date: '27.05.2024',
			what: 'test',
			kcal: '550',
			comment: '',
			id: 8,
			time: '09:48'
	  },
	  {
			date: '27.05.2024',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 9,
			time: '13:45'
	  },
	  {
			date: '27.05.2024',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 10,
			time: '17:30'
	  },
	  {
			date: '27.05.2024',
			what: 'test',
			kcal: '180',
			comment: '',
			id: 11,
			time: '18:19'
	  }
	],
	'28.05.2024': [
	  {
			date: '28.05.2024',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 12,
			time: '10:00'
	  },
	  {
			date: '28.05.2024',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 13,
			time: '14:45'
	  },
	  {
			date: '28.05.2024',
			what: 'test',
			kcal: '100',
			comment: '',
			id: 14,
			time: '14:48'
	  },
	  {
			date: '28.05.2024',
			what: 'test',
			kcal: '800',
			comment: '',
			id: 15,
			time: '19:04'
	  }
	]
};


export const dataStructure2: DataStructure = {
	kcal: [
		{
			date: '2024-05-30T10:00',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 0
		},
		{
			date: '2024-05-30T14:00',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 1
		},
		{
			date: '2024-05-30T18:13',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 2
		},
		{
			date: '2024-05-30T21:46',
			what: 'test',
			kcal: '300',
			comment: '',
			id: 3
		},
		{
			date: '2024-05-31T11:00',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 4
		},
		{
			date: '2024-05-31T12:00',
			what: 'test',
			kcal: '80',
			comment: '',
			id: 5
		},
		{
			date: '2024-05-31T14:48',
			what: 'test',
			kcal: '450',
			comment: '',
			id: 6
		},
		{
			date: '2024-05-31T15:10',
			what: 'test',
			kcal: '80',
			comment: '',
			id: 7
		},
		{
			date: '2024-05-31T21:34',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 8
		},
		{
			date: '2024-05-31T22:27',
			what: 'test',
			kcal: '300',
			comment: '',
			id: 9
		},
		{
			date: '2024-06-01T11:30',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 10
		},
		{
			date: '2024-06-01T16:40',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 11
		},
		{
			date: '2024-06-01T21:12',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 12
		},
		{
			date: '2024-06-01T22:31',
			what: 'test',
			kcal: '300',
			comment: '',
			id: 13
		},
		{
			date: '2024-06-01T00:05',
			what: 'test',
			kcal: '80',
			comment: '',
			id: 14
		},
		{
			date: '2024-06-02T12:45',
			what: 'test',
			kcal: '500',
			comment: '',
			id: 15
		},
		{
			date: '2024-06-02T14:13',
			what: 'test',
			kcal: '150',
			comment: '',
			id: 16
		},
		{
			date: '2024-06-02T17:32',
			what: 'test',
			kcal: '300',
			comment: '',
			id: 17
		},
		{
			date: '2024-06-02T18:20',
			what: 'test',
			kcal: '600',
			comment: '',
			id: 18
		},
		{
			date: '2024-06-02T20:47',
			what: 'test',
			kcal: '150',
			comment: '',
			id: 19 
		},
	],
	weight: [],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 2,
		user: 'test-user' 
	},
};

export const kcalInput2: KcalStructure[] = [
	{
		date: '2024-05-30T10:00',
		what: 'test',
		kcal: '500',
		comment: '',
	},
	{
		date: '2024-05-30T14:00',
		what: 'test',
		kcal: '700',
		comment: '',
	},
	{
		date: '2024-05-30T18:13',
		what: 'test',
		kcal: '600',
		comment: '',
	},
	{
		date: '2024-05-30T21:46',
		what: 'test',
		kcal: '300',
		comment: '',
	},
	{
		date: '2024-05-31T11:00',
		what: 'test',
		kcal: '700',
		comment: '',
	},
	{
		date: '2024-05-31T12:00',
		what: 'test',
		kcal: '80',
		comment: '',
	},
	{
		date: '2024-05-31T14:48',
		what: 'test',
		kcal: '450',
		comment: '',
	},
	{
		date: '2024-05-31T15:10',
		what: 'test',
		kcal: '80',
		comment: '',
	},
	{
		date: '2024-05-31T21:34',
		what: 'test',
		kcal: '600',
		comment: '',
	},
	{
		date: '2024-05-31T22:27',
		what: 'test',
		kcal: '300',
		comment: '',
	},
	{
		date: '2024-06-01T11:30',
		what: 'test',
		kcal: '500',
		comment: '',
	},
	{
		date: '2024-06-01T16:40',
		what: 'test',
		kcal: '500',
		comment: '',
	},
	{
		date: '2024-06-01T21:12',
		what: 'test',
		kcal: '700',
		comment: '',
	},
	{
		date: '2024-06-01T22:31',
		what: 'test',
		kcal: '300',
		comment: '',
	},
	{
		date: '2024-06-01T00:05',
		what: 'test',
		kcal: '80',
		comment: '',
	},
	{
		date: '2024-06-02T12:45',
		what: 'test',
		kcal: '500',
		comment: '',
	},
	{
		date: '2024-06-02T14:13',
		what: 'test',
		kcal: '150',
		comment: '',
	},
	{
		date: '2024-06-02T17:32',
		what: 'test',
		kcal: '300',
		comment: '',
	},
	{
		date: '2024-06-02T18:20',
		what: 'test',
		kcal: '600',
		comment: '',
	},
	{
		date: '2024-06-02T20:47',
		what: 'test',
		kcal: '150',
		comment: '',
	},
];

export const dataStructure3: DataStructure =
{
	kcal: [
		{
			what: 'test',
			kcal: '123',
			date: '2024-05-24T19:27',
			comment: 'test',
			id: 0 
		},
	],
	weight: [],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 3,
		user: 'test-user'
	}
};

export const kcalInput3: KcalStructure = {
	what: 'test',
	kcal: '123',
	date: '2024-05-24T19:27',
	comment: 'test',
};


export const dataStructure4: DataStructure = {
	kcal: [
		{
			what: 'test',
			kcal: '123',
			date: '2024-05-24T19:27',
			comment: 'test',
			id: 0
		},
		{
			what: 'test2',
			kcal: '1234',
			date: '2024-05-24T09:27',
			comment: 'test2',
			id: 1
		}
	],
	weight: [],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 3,
		user: 'test-user'
	}
};

export const kcalInput4: KcalStructure[] = [
	{
		what: 'test',
		kcal: '123',
		date: '2024-05-24T19:27',
		comment: 'test',
	},
	{
		what: 'test2',
		kcal: '1234',
		date: '2024-05-24T09:27',
		comment: 'test2',
	}
];

export const kcalInput5:KcalStructure[] = [
	{
		what: 'test',
		kcal: '123',
		date: '2024-05-24T19:27',
		comment: '',
	},
	{
		what: 'test3',
		kcal: '444',
		date: '2024-05-04T18:46',
		comment: '',
	},
	{
		what: 'test2',
		kcal: '444',
		date: '2024-05-04T18:46',
		comment: '',
	},
	{
		what: 'test4',
		kcal: '444',
		date: '2024-05-04T18:46',
		comment: '',
	},
	{
		what: 'test',
		kcal: '200',
		date: '2024-05-04T18:46',
		comment: '',
	},
	{
		what: 'test2',
		kcal: '444',
		date: '2024-05-14T18:46',
		comment: '',
	},
	{
		what: 'test2',
		kcal: '1234',
		date: '2024-05-24T09:27',
		comment: '',
	}
];

export const dataStructure6: DataStructure = {
	kcal: [],
	weight: [
		{
			date: '2024-04-07',
			weight: '115.8',
			'waist': '114',
			id: 0
		},
		{
			date: '2024-04-21',
			weight: '114.1',
			'waist': '113',
			id: 1
		},
		{
			date: '2024-05-07',
			weight: '112.9',
			'waist': '112.5',
			id: 2
		},
		{
			date: '2024-05-21',
			weight: '111.9',
			'waist': '112.5',
			id: 3
		},
		{
			date: '2024-06-07',
			weight: '111.5',
			'waist': '112',
			id: 4
		}
	],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 3,
		user: 'test-user'
	}
};

export const weightInput6: WeightStructure[] = [
	{
		date: '2024-04-07',
		weight: '115.8',
		'waist': '114',
	},
	{
		date: '2024-04-21',
		weight: '114.1',
		'waist': '113',
	},
	{
		date: '2024-05-07',
		weight: '112.9',
		'waist': '112.5',
	},
	{
		date: '2024-05-21',
		weight: '111.9',
		'waist': '112.5',
	},
	{
		date: '2024-06-07',
		weight: '111.5',
		'waist': '112',
	}
];

export const dataStructure7: DataStructure = {
	kcal: [
		{
			date: '2024-07-17T06:00',
			what: 'test',
			kcal: '450',
			comment: '',
			id: 0
		},
		{
			date: '2024-07-17T13:00',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 1
		},
		{
			date: '2024-07-17T18:24',
			what: 'test',
			kcal: '700',
			comment: '',
			id: 2
		},
		{
			date: '2024-07-17T19:07',
			what: 'test',
			kcal: '120',
			comment: '',
			id: 3
		},
		{
			date: '2024-07-18T06:00',
			what: 'test',
			kcal: '450',
			comment: '',
			id: 4
		}
	],
	weight: [],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 3,
		user: 'test-user'
	}
};

export const kcalInput7: KcalStructure[] = [
	{
		date: '2024-07-17T06:00',
		what: 'test',
		kcal: '450',
		comment: '',
	},
	{
		date: '2024-07-17T13:00',
		what: 'test',
		kcal: '700',
		comment: '',
	},
	{
		date: '2024-07-17T18:24',
		what: 'test',
		kcal: '700',
		comment: '',
	},
	{
		date: '2024-07-17T19:07',
		what: 'test',
		kcal: '120',
		comment: '',
	},
	{
		date: '2024-07-18T06:00',
		what: 'test',
		kcal: '450',
		comment: '',
	}
];

export const dataStructure8: DataStructure = {
	kcal: [],
	weight: [
	  {
			date: '2024-05-24',
			weight: '80',
			'waist': '70',
			id: 0
	  },
	  {
			date: '2024-05-04',
			weight: '85',
			'waist': '75',
			id: 1
	  }
	],
	user: {
	  dailyKcalTarget: 2000,
	  weightTarget: 90,
	  color: '#5f9ea0',
	  kcalHistoryCount: 3,
	  user: 'test-user'
	}
};

export const weightInput8: WeightStructure[] = [
	{
		  date: '2024-05-24',
		  weight: '80',
		  'waist': '70',
	},
	{
		  date: '2024-05-04',
		  weight: '85',
		  'waist': '75',
	}
];

export const dataStructure9: DataStructure = {
	kcal: [
	  {
			what: 'test',
			kcal: '123',
			date: '2024-05-24T19:27',
			comment: '',
			id: 0
	  },
	  {
			what: 'test3',
			kcal: '444',
			date: '2024-05-04T18:46',
			comment: '',
			id: 1
	  },
	  {
			what: 'test2',
			kcal: '1234',
			date: '2024-05-24T09:27',
			comment: '',
			id: 2
	  }
	],
	weight: [],
	user: {
	  dailyKcalTarget: 2000,
	  weightTarget: 90,
	  color: '#5f9ea0',
	  kcalHistoryCount: 3,
	  user: 'test-user'
	}
};

export const kcalInput9: KcalStructure[] = [
	{
		  what: 'test',
		  kcal: '123',
		  date: '2024-05-24T19:27',
		  comment: '',
	},
	{
		  what: 'test3',
		  kcal: '444',
		  date: '2024-05-04T18:46',
		  comment: '',
	},
	{
		  what: 'test2',
		  kcal: '1234',
		  date: '2024-05-24T09:27',
		  comment: '',
	}
];

export const dataStructure10: DataStructure = {
	kcal: [],
	weight: [
	  {
			date: '2024-05-29',
			weight: '80',
			'waist': '70',
			id: 0
	  }
	],
	user: {
	  dailyKcalTarget: 2000,
	  weightTarget: 90,
	  color: '#5f9ea0',
	  kcalHistoryCount: 3,
	  user: 'test-user'
	}
};

export const weightInput10: WeightStructure = {
		  date: '2024-05-29',
		  weight: '80',
		  'waist': '70',
};

export const dataStructure11: DataStructure = {
	kcal: [
		{
			what: 'test',
			kcal: '123',
			date: '2024-05-24T19:27',
			comment: 'test',
			id: 1
		},
		{
			what: 'test2',
			kcal: '1234',
			date: '2024-05-24T09:27',
			comment: 'test2',
			id: 1
		}
	],
	weight: [
		{
			date: '2024-05-24',
			weight: '80',
			waist: '70',
			id: 1
		},
		{
			date: '2024-05-25',
			weight: '81',
			waist: '71',
			id: 1
		}
	],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 3,
		user: 'test-user'
	}
};

export const dataStructure12: DataStructure = {
	kcal: [],
	weight: [

		{
			date: '2024-05-24',
			weight: '80',
			waist: '70',
			id: 0
		},
		{
			date: '2024-05-28',
			weight: '81',
			waist: '71',
			id: 1
		},
	],
	user: {
		dailyKcalTarget: 2000,
		weightTarget: 90,
		color: '#5f9ea0',
		kcalHistoryCount: 3,
		user: 'test-user'
	}
}; 