// Modules
import boolean_icon from './boolean_icon.svg';
const { Node } = await modular.require('@edisonai/nodemap/node');

// Processing function
//----------------------------------------------------------------------------------------------------

export default class BooleanNode extends Node {

	static template = {

		name: "Bool",
		category: "Primitives",
		color: "rgba(255, 248, 128, 0.8)",
		icon: boolean_icon,

		inputs: [{}],
		outputs: [{}],

		settings: {
			showIcon: false,
			value: false
		},

		gui: [
			{ type: 'checkbox', setting: 'value' }
		],
	}

	constructor(node, options) {
		super(node, options);
	}

	// Convert value to string
	main(caller, value) {

		// Convert to string
		this.clearLogs();
		const converted = value === 'false' ? false : Boolean(value);
		this.settings.value = converted;
		this.log(converted);

		// Clear and send
		this.inputs[0].clear();
		this.outputs[0].send(converted);
		this.emit('update');
	}

	// Override start
	start() {

		// Ignore if we're connected to anything
		for (const input of this.inputs) {
			if (input.connections?.size) {
				return;
			}
		}

		this.clearLogs();
		this.log(this.settings.value);
		this.outputs[0].send(this.settings.value);
	}

	supply() {

		// Reachback if we're connected to anything
		for (const input of this.inputs) {
			if (input.connections?.size) {
				this.reachBack();
			}
		}

		this.clearLogs();
		this.log(this.settings.value);
		this.outputs[0].send(this.settings.value);
	}
}
