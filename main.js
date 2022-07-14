"use strict";

/*
 * Created with @iobroker/create-adapter v1.31.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");

// Load your modules here, e.g.:
// const fs = require("fs");
//const SerialPort = require('serialport');
const connectionFGW = require('./lib/tools/connectionFGW');
const os = require('os');
const fs = require('fs');
const path = require('path');

const PLATFORM = os.platform();

// define variables   // end of function openConnection
let AVAILABLE_PORTS = {};
const con = new connectionFGW();
//let SERIAL_PORT = null;


class Myfirsttest extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "myfirsttest",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
		this.on("exit", this.onUnload.bind(this));

		//error handling code within middleware
		this.on('uncaughtException', function(e) {
							this.log.error('uncaughtException onReady test' + e);
					});
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// Reset the connection indicator during startup
		this.setState("info.connection", false, true);

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info("config option1: " + this.config.option1);
		this.log.info("config option2: " + this.config.option2);
		this.log.info("config serial Port: " + this.config.serialport_PORT);
		this.log.info("config baud rate serial Port: " + this.config.serialport_BAUDRATE);

		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
		await this.setObjectNotExistsAsync("testVariable", {
			type: "state",
			common: {
				name: "testVariable",
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		this.subscribeStates("testVariable");
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates("*");

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		await this.setStateAsync("testVariable", true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		await this.setStateAsync("testVariable", { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync("admin", "iobroker");
		this.log.info("check user admin pw iobroker: " + result);

		result = await this.checkGroupAsync("admin", "admin");
		this.log.info("check group user admin group admin: " + result);

		// // get the list of available serial ports. Needed for win32 systems.
		// const ports = await SerialPort.list();
		//
		// this.log.info('actual Ports:' + ports);
		//
		// AVAILABLE_PORTS = ports.map(p => p.path);

		// am Besten die Liste der Ports auch im connectionFGW machen

// Lösugn siehe https://stackoverflow.com/questions/40884153/try-catch-blocks-with-async-await
// 3 Simple Example mit "async function myFetch
// https://stackoverflow.com/questions/40884153/try-catch-blocks-with-async-await
// https://www.mariokandut.com/handling-errors-in-asynchronous-functions-node-js/
// https://itnext.io/error-handling-with-async-await-in-js-26c3f20bc06a
// https://www.valentinog.com/blog/throw-async/
//
// https://stackoverflow.com/questions/7310521/node-js-best-practice-exception-handling
// https://www.joyent.com/node-js/production/design/errors
// https://goldbergyoni.com/checklist-best-practices-of-node-js-error-handling/
// https://www.zeolearn.com/magazine/nodejs-best-practices
// https://www.toptal.com/nodejs/node-js-error-handling


		// try to open serial port
		try {
			if ( this.config.serialport_PORT && ( this.config.serialport_PORT != "Choose" ) && this.config.serialport_BAUDRATE) {
				var con = new connectionFGW( this.config.serialport_PORT, this.config.serialport_BAUDRATE );
												
				con.on('error', function(e) {
									this.log.error('connectionFGW:' + e);
							})


				//
				// SERIAL_PORT = new SerialPort(	this.config.serialport_PORT
				// 															,{ baudRate: this.config.serialport_BAUDRATE}
				// 															, err => {
				// 																				if (err) {
				// 																					this.log.error( 'SerialPort error: ' + err );
				// 																				};
				// 															});
				// SERIALPORT_ESP3_PARSER = SERIAL_PORT.pipe(new SERIALPORT_PARSER_CLASS());
				// await this.packetListenerSerial();
				this.log.info('SerialPort started with port:' + this.config.serialport_PORT + '; baud:' + this.config.serialport_BAUDRATE );
				this.log.info('SerialPort started with port:' + typeof( this.config.serialport_PORT ) + '; baud:' + typeof( this.config.serialport_BAUDRATE ));
				this.log.info('SerialPort started with port:' + con.path + '; baud:' + con.baudRate );

			} else if ( this.config.serialport_PORT == "Choose" ) {	// not a possible serial PORT
				this.log.info('SerialPort can not start with port: ' + this.config.serialport_PORT );
			}
		} catch (e) {
			this.log.error('onReady error "open serial port": ' + e);
		}
		this.log.info('complete ready...');
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);
			//
			// if ( SERIAL_PORT !== null ) {
			// 	if ( SERIAL_PORT.isOpen ) {
			// 		SERIAL_PORT.close();
			// 	}
			// }

			if ( con !== null ) {
				if ( con.isOpen ) {
					con.close();
				}
			}

			this.setState('info.connection', false, true);
			this.log.info('cleaned everything up...');
			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }



	/**
	 * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	 * Using this method requires "common.message ( "messagebox": true, )" property to be set to true in io-package.json
	 * @param {ioBroker.Message} obj
	 */
	async onMessage(obj) {

		this.log.info("onMessage gekommen")
		this.log.info(obj.from);
		this.log.info(obj.command);
		this.log.info(obj.callback);
		this.log.info(obj.message);

		// responds to the adapter that sent the original message
		function respond(response, that) {
			if (obj.callback)
				that.sendTo(obj.from, obj.command, response, obj.callback);
		}
		//
		switch(obj.command){
			case 'listSerial':
				// enumerate serial ports for admin interface
				try {
					const ports = this.listSerial();
					this.log.info(JSON.stringify(ports));
					respond({ error: null, result: ports }, this);
				} catch (e) {
					respond({ error: e, result: ['Not available'] }, this);
					this.log.error('onMessage error "listSerial": ' + e);
				}
				break;
			case 'getManufacturerList':
				respond(Enocean_manufacturer, this);
				break;
			case 'getEEPList':
				respond(EEPList, this);
				break;
			case 'autodetect':
				teachinMethod = {teachinMethod: codes.telegram_type[obj.message.teachin_method], name: obj.message.device, mfr: obj.message.mfr};
				this.setState('gateway.teachin', {val: true, expire: 60});
				if(teachinMethod.teachinMethod === 'C6'){
					await this.makeControllerPostmaster();
					await this.enableSmartACKteachin();
				}
				respond({ error: null, result: 'Ready' }, this);
				break;
			case 'newDevice':
				new predifnedDeviceTeachIn(this, obj.message.device, obj.message.mfr, obj.message.id);
				respond({ error: null, result: 'Ready' }, this);
				break;
			case 'getDevices': {
				const devices = require('./lib/definitions/devices.json');
				respond(devices, this);
				break;
			}
			case 'setEEPs': {
				await this.extendObjectAsync(obj.message.id, {
					'native': {
						eep: obj.message.eep
					}
				});
				break;
			}
		}
	}



	// filter serial devices function filterSerialPorts(path) {
	filterSerialPorts(path) {

		// get only serial port names
		if (!(/(tty(ACM|USB|AMA|MFD|Enocean|enocean|EnOcean|\.usbserial-)|rfcomm|(serial\/by-id))/).test(path)) return false;

		return fs
			.statSync(path)
			.isCharacterDevice();
	}

	// list serial ports
	listSerial() {
		let result;

		if (PLATFORM === 'linux' || PLATFORM === 'darwin') {
			// Filter out the devices that aren't serial ports
			const devDirName = '/dev';
			const byIdDirName = '/dev/serial/by-id';

			let ports, byId;
			try {
				ports = fs
					.readdirSync(devDirName)
					.map(function (file) {
						return path.join(devDirName, file);
					})
					.filter(this.filterSerialPorts)
					.map(function (port) {
						return { path: port };
					});
			} catch (e) {
				this.log.error('Cannot read "listSerial" 1: "' + devDirName + '": ' + e);
				ports = [];
			}

			// only by DirName actually - erstmal nur die Ports im DirName ohne die Ports by ID
			//
			// try {
			// 	byId = fs
			// 		.readdirSync(byIdDirName)
			// 		.map(function (file) {
			// 			return path.join(byIdDirName, file);
			// 		})
			// 		.filter(this.filterSerialPorts)
			// 		.map(function (port) {
			// 			return { path: port };
			// 		});
			// } catch (e) {
			// 	this.log.error('Cannot read "listSerial" 2: "' + byIdDirName + '": ' + e);
			// }
			// for(const i in byId){
			// 	ports.push(byId[i]);
			// }

			result = ports.map(p => p.path);

		} else if (PLATFORM === 'win32') {
			result = AVAILABLE_PORTS;
		}
		return result;
	}
}

// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Myfirsttest(options);
} else {
	// otherwise start the instance directly
	new Myfirsttest();
}
