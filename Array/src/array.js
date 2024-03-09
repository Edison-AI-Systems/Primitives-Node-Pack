// Modules
import json5 from 'json5';
import array_icon from './array_icon.svg';
const { Node } = await modular.require('@edisonai/nodemap/node');

// Processing function
//----------------------------------------------------------------------------------------------------

export default class ArrayNode extends Node {

	static template = {

		name: "Array",
		category: "Primitives",
		color: "rgba(255, 248, 128, 0.8)",
		icon: array_icon,

		inputs: [{ name: '...', accept: 'complete' }],
		outputs: [{ name: '...' }],

		settings: {

			array: [],

			inputs: {
				canAdd: true,
				canRemove: true,
				canEditName: true,
				canEditAccept: true,
				canAcceptStream: true,
				placeholder: 'action',
				nameOptions: ['at', 'push', 'pop', 'shift', 'unshift', '...'],
				default: {
					accept: 'complete'
				}
			},

			outputs: {
				canAdd: true,
				canRemove: true,
				canEditName: true,
				canEditAccept: true,
				placeholder: 'result',
				nameOptions: ['at', 'push', 'pop', 'shift', 'unshift', '...']
			}
		},

		gui: {
			type: 'group', direction: 'vertical', elements: [
				{ type: 'object', setting: 'array', style: { width: 200, height: 100 } }
			]
		},
	}

	constructor(node, options) {
		super(node, options);
	}

	at(caller, index) {

		this.clearLogs();
		this.log('Getting value at index:', index);

		const value = this.settings.array.at(index);

		// Send to outputs
		caller.clear();
		this.outputs.forEach((output) => { if (output.name === 'at') { output.send(value); } });

		// Set state and update
		this.setState('done');
		this.emit('update');
	}

	push(caller, value) {

		this.clearLogs();
		this.log('Pushing:', value);

		this.settings.array.push(value);

		// Send to outputs
		caller.clear();
		this.outputs.forEach((output) => { if (output.name === 'push') { output.send(this.settings.array); } });

		// Set state and update
		this.setState('done');
		this.emit('update');
	}

	unshift(caller, value) {

		this.clearLogs();
		this.log('Unshifting:', value);

		this.settings.array.unshift(value);

		// Send to outputs
		caller.clear();
		this.outputs.forEach((output) => { if (output.name === 'unshift') { output.send(this.settings.array); } });

		// Set state and update
		this.setState('done');
		this.emit('update');
	}

	pop(caller) {

		const value = this.settings.array.pop();

		this.clearLogs();
		this.log('Popped:', value);

		// Send to outputs
		caller.clear();
		this.outputs.forEach((output) => { if (output.name === 'pop') { output.send(value); } });

		// Set state and update
		this.setState('done');
		this.emit('update');
	}

	shift(caller) {

		const value = this.settings.array.shift();

		this.clearLogs();
		this.log('Shifted:', value);

		// Send to outputs
		caller.clear();
		this.outputs.forEach((output) => { if (output.name === 'shift') { output.send(value); } });

		// Set state and update
		this.setState('done');
		this.emit('update');
	}

	// Replace the entire array
	main(caller, value) {

		this.log('Replacing!', value);

		this.settings.array = convertToArray(value);

		this.clearLogs();
		this.log(this.settings.array);

		// Send all if output is named 'all', else send only item at index
		caller.clear();
		this.outputs.forEach((output) => {
			if (output.name === '...') { output.send(this.settings.array); }
			else if (!output.name) { output.send(this.settings.array[output.index]); }
		});

		this.setState('done');
		this.emit('update');
	}

	// Act as origin if we are not connected to anything
	start() {

		for (const input of this.inputs) {
			if (input.connections?.size) {
				return;
			}
		}

		// Send all if output is named 'all', else send only item at index
		this.outputs.forEach((output) => {
			if (output.name === '...') { output.send(this.settings.array); }
			else if (!output.name) { output.send(this.settings.array[output.index]); }
		});
	}

	// Send all if output is named 'all', else send only item at index
	supply(output) {
		if (output.name === '...') { output.send(this.settings.array); }
		else if (!output.name) { output.send(this.settings.array[output.index]); }
	}
}

// Convert unknown datatype to array
function convertToArray(value) {
	if (typeof value === 'object') { return objectToArray(value); }
	if (typeof value === 'string') { return stringToArray(value); }
}

// Convert string to array
function stringToArray(string) {
	try { return objectToArray(json5.parse(string)); }
	catch { return [string]; }
}

// Convert object to array
function objectToArray(object) {
	if (Array.isArray(object)) { return object; }
	else { return [object]; }
}
