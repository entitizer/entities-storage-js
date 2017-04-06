
import { Promise } from '../utils';
import { NAMES, getModel } from './models';

export function deleteTables(secret: string): Promise<void> {

	if (secret !== 'iam-sure') {
		return Promise.reject(new Error('Wake up dude!'));
	}

	return Promise.map(NAMES, function (name) {
		return getModel(name).deleteTableAsync();
	});
};
