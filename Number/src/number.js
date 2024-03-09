// Modules
import number_icon from './number_icon.svg';
const { Node } = await modular.require('@edisonai/nodemap/node');

// Processing function
//----------------------------------------------------------------------------------------------------

export default class NumberNode extends Node {

	static template = {

		name: "Number",
		category: "Primitives",
		color: "rgba(255, 248, 128, 0.8)",
		icon: number_icon,

		inputs: [{}],
		outputs: [{}],

		settings: {
			number: undefined
		},

		gui: [
			{ type: 'number', setting: 'number', placeholder: '123...' }
		],
	}

	constructor(node, options) {
		super(node, options);
	}

	// Convert value to string
	main(caller, value) {

		// Convert to string
		this.clearLogs();
		const converted = Number(value);
		this.settings.number = converted;
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

		this.execute('supply');
	}

	supply() {

		// Reach back if we're connected to anything
		for (const input of this.inputs) {
			if (input.connections?.size) {
				this.reachBack();
			}
		}

		this.clearLogs();
		this.log(this.settings.number);
		this.outputs[0].send(this.settings.number);
	}
}
