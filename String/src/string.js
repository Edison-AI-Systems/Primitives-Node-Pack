// Modules
import string_icon from './string_icon.svg';
const { Node } = await modular.require('@edisonai/nodemap/node');

// Processing function
//----------------------------------------------------------------------------------------------------

export default class StringNode extends Node {

	static template = {

		name: "String",
		category: "Primitives",
		color: "rgba(255, 248, 128, 0.8)",
		icon: string_icon,

		inputs: [{}],
		outputs: [{}],

		settings: {
			string: ''
		},

		gui: [
			{ type: 'textarea', setting: 'string', placeholder: 'Hello world...', autoResize: true, style: { resize: 'horizontal' } }
		],
	}

	constructor(node, options) {
		super(node, options);
	}

	// Convert value to string
	main(caller, value) {

		// Convert to string
		this.clearLogs();
		const converted = String(value);
		this.settings.string = converted;
		this.log(converted);

		// Clear and send
		this.inputs[0].clear();
		this.outputs[0].send(converted);
		this.emit('update');
	}

	// Called on 'start' command from nodemap
	start() {

		// Do nothing if connected
		if (this.inputs[0].connections?.size) {
			return;
		}

		this.clearLogs();
		this.log(this.settings.string);
		this.outputs[0].send(this.settings.string);
	}

	// Facilicate reach-back
	supply() {

		// Reachback if connected
		if (this.inputs[0].connections?.size) {
			this.reachBack();
			return;
		}

		this.clearLogs();
		this.log(this.settings.string);
		this.outputs[0].send(this.settings.string);
	}
}
