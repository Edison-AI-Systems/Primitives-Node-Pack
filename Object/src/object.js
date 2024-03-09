// Modules
import json5 from 'json5';
import object_icon from './object.svg';
const { Node } = await modular.require('@edisonai/nodemap/node');

// Processing function
//----------------------------------------------------------------------------------------------------

export default class ObjectNode extends Node {

	static template = {

		name: "Object",
		category: "Primitives",
		color: "rgba(255, 248, 128, 0.8)",
		icon: object_icon,

		inputs: [{ name: '...', accept: 'complete' }],
		outputs: [{ name: '...', }],

		settings: {

			object: {},

			inputs: {
				canAdd: true,
				canRemove: true,
				canEditName: true,
				canEditAccept: true,
				canAcceptStream: false,
				placeholder: 'param',
				nameOptions: ['...'],
				default: {
					accept: 'complete'
				}
			},

			outputs: {
				canAdd: true,
				canRemove: true,
				canEditName: true,
				canEditAccept: true,
				placeholder: 'param',
			}
		},

		gui: {
			type: 'group', direction: 'vertical', elements: [
				{ type: 'object', setting: 'object', style: { width: 200, height: 100 } }
			]
		},
	}

	constructor(node, options) {
		super(node, options);
	}

	read(caller, value) {

		this.log('Reading object!', this.settings.object);

		caller.clear();
		this.outputs.forEach((output) => { if (this.settings.object[output.name]) { output.send(this.settings.object[output.name]); } })

		this.setState('done');
		this.emit('update');
	}

	// Replace the entire object or single parameter
	main(caller, value) {

		this.log('Replacing!', value);

		if (caller.name) {
			try { this.settings.object[caller.name] = convertToObject(value); }
			catch { this.settings.object[caller.name] = value; }
		}
		else {
			this.settings.object = convertToObject(value);
		}

		this.clearLogs();
		this.log(this.settings.object);
		this.settings.outputs.nameOptions = [...Object.keys(this.settings.object || {}), '...'];

		caller.clear();
		this.outputs.forEach((output) => { if (this.settings.object[output.name]) { output.send(this.settings.object[output.name]); } })
		this.outputs[0].send(this.settings.object);

		this.setState('done');
		this.emit('update');
	}

	start() {

		for (const input in this.inputs) {
			if (input.connections?.size) {
				return;
			}
		}

		this.outputs.forEach((output) => {
			if (!output.name) { output.send(this.settings.object); }
			else if (output.name in this.settings.object) { output.send(this.settings.object[output.name]); }
		});
	}

	supply(output) {
		if (!output.name) { output.send(this.settings.object); }
		else if (output.name in this.settings.object) { output.send(this.settings.object[output.name]); }
	}
}

// Convert unknown datatype to array
function convertToObject(value) {
	if (!value) { return {}; }
	if (typeof value === 'object') { return { ...value }; }
	if (typeof value === 'string') { return { ...json5.parse(value) }; }
	return value;
}
