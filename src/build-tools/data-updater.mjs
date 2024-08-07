import {
	readFileSync, writeFileSync
} from 'node:fs';

const addIdToData = (dataStructure) => {
	if (Array.isArray(dataStructure.kcal) && dataStructure.kcal.length > 0) {
		for (let i = 0; i < dataStructure.kcal.length; i++) {
			dataStructure.kcal[i].id = i;
		}
	}
	if (Array.isArray(dataStructure.weight) && dataStructure.weight.length > 0) {
		for (let i = 0; i < dataStructure.weight.length; i++) {
			dataStructure.weight[i].id = i;
		}
	}
	return dataStructure;
};

(() => {
	if (process.argv.length < 3) {
		console.log('usage: node ./data-updater.js <path>');
		return;
	}

	const path = process.argv[2];

	let content = null;
	try {
		content = readFileSync(path);
	} catch (e) {
		console.error(`Could not open file '${path}', reason: ${e.message}`);
		return;
	}

	try {
		content = JSON.parse(content);
	} catch (e) {
		console.error(`Could not parse data, reason: ${e.message}`);
		return;
	}

	if (content.kcal === undefined) {
		throw new Error('kcal member is not defined in content!');
	}
	if (content.weight === undefined) {
		throw new Error('kcal weight is not defined in content!');
	}
	if (content.user === undefined) {
		throw new Error('user member is not defined in content!');
	}

	content = addIdToData(content);
	writeFileSync(path, JSON.stringify(content, null, 2));
})();
