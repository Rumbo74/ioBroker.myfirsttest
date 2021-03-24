'use strict';

const RadioTelegram = require('./ESP3Packet').RadioTelegram;
const ResponseTelegram = require('./ESP3Packet').ResponseTelegram;
const MSCTelegram = require('./ESP3Packet').MSCTelegram;
const ESP3Packet = require('./ESP3Packet').ESP3Packet;
const OneBSTeachIn = require('./ESP3Packet').OneBSTeachIn;
const FourBSTeachIn = require('./ESP3Packet').FourBSTeachIn;
const UTETeachIn = require('./ESP3Packet').UTETeachIn;

const jsonLogic = require('json-logic-js');

const ByteArray = require('./byte_array');

const Enocean_manufacturer = require('../definitions/manufacturer_list.json');
const EEPList = require('../definitions/EEPinclude');
const eltakoDevices = require('../definitions/eltako').mscTelegrams;
const devices = require('../definitions/devices.json');

const OneBS = 213;
const FourBS = 165;
const RPS = 246;
const UTE = 212;
const MSC = 209;
const SmartACK = 198;
const VLD = 210;

class handleType1 {
	/**
	 * @param {Object} that
	 * @param {ESP3Packet} ESP3Packet
	 */
	constructor(that, ESP3Packet) {
		this.adapter = that;
		this.info = that.log.info;
		this.telegram = new RadioTelegram(ESP3Packet);
		this.senderID = this.telegram.senderID;
		this.tType = this.telegram.type;
		this.rssi = ESP3Packet.optionalData['5'];


		//bind class functions to context of constructor
		this.main.bind(this);

		this.adapter.log.debug('Message for ID ' + this.senderID + ' has been received.');

		this.main();

	}

	async main() {
		//get device object
		const dev = await this.adapter.getObjectAsync(this.adapter.namespace + '.' + this.senderID);
		if (dev !== null) {
			//set RSSI
			await this.adapter.setStateAsync(this.telegram.senderID + '.rssi', {val: - this.rssi, ack: true});
			const eep = dev.native.eep;
			const rorg = this.telegram.type.toString(16).toUpperCase();
			for (const e in eep) {

				const eep1 = eep[e].replace(/-/g, '');
				const profile = EEPList[eep1];
				const rorgIn = profile.rorg_number.replace('0x', '');

				if (rorg === rorgIn) {


					for (const c in profile.case) {

						//Check if there are conditions to choose the right data handling
						//conditions are optional
						let condition_res = null;
						if (profile.case[c].condition !== undefined) {

							for (const s in profile.case[c].condition) {
								const keys = Object.keys(profile.case[c].condition);
								if (keys[0] === 'statusfield') {
									const condition = profile.case[c].condition[s];

									if (condition.length !== undefined) {
										for (const con in profile.case[c].condition[s]) {
											const check = profile.case[c].condition[s][con];
											const bitoffs = parseInt(check.bitoffs);
											const bitsize = parseInt(check.bitsize);
											const value = ByteArray.from(this.telegram.status).getValue(bitoffs, bitsize);
											if (value === parseInt(check.value) && condition !== false) {
												condition_res = true;
											} else {
												condition_res = false;
											}

										}
									}
								} else {
									const condition = profile.case[c].condition[s];

									if (condition.length !== undefined) {
										for (const con in profile.case[c].condition[s]) {
											const check = profile.case[c].condition[s][con];
											const bitoffs = parseInt(check.bitoffs);
											const bitsize = parseInt(check.bitsize);
											const value = ByteArray.from(this.telegram.userData).getValue(bitoffs, bitsize);
											const testResult = jsonLogic.apply(check.value, {'value': value});
											if (testResult === true || value === parseInt(check.value) && condition !== false) {
												condition_res = true;
											} else {
												condition_res = false;
											}

										}
									} else {
										const check = profile.case[c].condition[s];
										const bitoffs = parseInt(check.bitoffs);
										const bitsize = parseInt(check.bitsize);
										const value = ByteArray.from(this.telegram.userData).getValue(bitoffs, bitsize);
										const testResult = jsonLogic.apply(check.value, {'value': value});
										if (testResult === true || value === parseInt(check.value) && condition !== false) {
											condition_res = true;
										} else {
											condition_res = false;
										}
									}
								}

							}

						}
						//look for data and decode them
						if (condition_res === true || condition_res === null) {

							if (profile.case[c].datafield !== undefined) {

								for (const x in profile.case[c].datafield) {
									const datafield = profile.case[c].datafield[x];

									const {shortcut, val} = await this.getValue(this.telegram.userData, datafield);
									const {newVal, unit} = await this.convertValue(datafield, val);
									if (!shortcut) {
										break;
									}
									if (newVal !== null) {
										await this.setState(this.telegram.senderID, shortcut, newVal);
									}

									if (unit !== null) {
										this.extendObject(this.telegram.senderID, shortcut, {common: {unit: unit}});
									}

								}
							} else {
								for (const z in profile.case[c]) {
									const datafield = profile.case[c][z];
									const {shortcut, val} = await this.getValue(this.telegram.userData, datafield);
									const {newVal, unit} = await this.convertValue(datafield, val);

									if (newVal !== null) {
										this.setState(this.telegram.senderID, shortcut, newVal);
									}

									if (unit !== null) {
										this.extendObject(this.telegram.senderID, shortcut, {common: {unit: unit}});
									}
								}
							}
						}
					}
				}
			}
		}
	}


	async setState(deviceId, shortcut, value){
		await this.adapter.setStateAsync(this.adapter.namespace + '.' + deviceId + '.' + shortcut, {val: value, ack: true});
	}

	async extendObject(deviceId, shortcut, obj){
		await this.adapter.extendObjectAsync(this.adapter.namespace + '.' + deviceId + '.' + shortcut, obj);
	}

	async convertValue(datafield, value) {
		let test = false;
		let unit = null;
		let secondArg;	//if secondArgument is given this will be filled with this value that comes from other datafield

		if(datafield.bitType && datafield.bitType === 'MSB'){
			value = await invertBitString(value);
		}
		if (datafield.secondArgument && !datafield.secondArgument.bitType) {
			secondArg = await this.getValue(this.telegram.userData, datafield.secondArgument);
			test = jsonLogic.apply(datafield.condition, {'value': value, 'value2': secondArg.val});
			if (test === false) test = null;
		}else if(datafield.secondArgument && datafield.secondArgument.bitType === 'MSB'){
			secondArg = await this.getValue(this.telegram.userData, datafield.secondArgument);
			test = await invertBitString(secondArg.val);
		}else if (datafield.condition) {
			test = jsonLogic.apply(datafield.condition, {'value': value});
		}
		if(test !== null && datafield.value){
			test = jsonLogic.apply(datafield.value, {'value': value});
		}
		if(typeof test === 'number' && datafield.decimals){
			const num = Number(test);
			test = num.toFixed(datafield.decimals);
		}

		if(datafield.unit){
			unit = jsonLogic.apply(datafield.unit, {'value2': secondArg.val});
		}

		return {newVal: test, unit: unit};
	}


	/**
	 * get Value from data telegram
	 * @param {any} telegram
	 * @param {object} data - datafield description from EEP file
	 * @returns {Promise<{val: (Promise<{val: *, shortcut: *}>|number|string), shortcut}>}
	 */
	async getValue(telegram, data){
		const shortcut = data.shortcut ? data.shortcut : '';
		const bitoffs = parseInt(data.bitoffs);
		const bitsize = parseInt(data.bitsize);
		const value = ByteArray.from(telegram).getValue(bitoffs, bitsize);
		return {shortcut: shortcut, val: value};
	}

	logInfo(variable){
		const info = {};
		info.type = typeof variable;
		info.length = variable.length;
		if(typeof variable !== 'string' || typeof variable !== 'number'){
			info.value = JSON.stringify(variable);
		}
		info.value = variable;

		this.adapter.log.info(JSON.stringify(info));
	}
}

class handleType2{
	/**
	 * @param {Object} that
	 * @param {ESP3Packet} ESP3Packet
	 */
	constructor(that, ESP3Packet) {
		this.adapter = that;
		this.info = that.log.info;
		this.telegram = new ResponseTelegram(ESP3Packet);
		this.senderID = this.telegram.senderID;
		this.tType = this.telegram.type;
		//this.rssi = ESP3Packet.optionalData['5'];

		//bind class functions to context of constructor
		this.main.bind(this);

		this.main();
	}

	async main(){
		const returnCode = this.telegram.data[0];
		this.info(returnCode);
	}
}

class handleTeachIn{
	/**
	 *
	 * @param {Object} that
	 * @param {ESP3Packet} ESP3Packet
	 */
	constructor(that, ESP3Packet) {
		this.adapter = that;
		this.sendData = that.sendData;
		this.log = that.log;
		this.telegram = new RadioTelegram(ESP3Packet);
		this.senderID = this.telegram.senderID;
		this.tType = this.telegram.type;

		this.main.bind(this);

		this.main();
	}

	async main() {
		switch(this.tType) {
			case FourBS:
			{
				const teachinData = new FourBSTeachIn(this.telegram.userData);
				if (teachinData.teachIn === 0) {
					const FUNC = await addLeadingZero(teachinData.EEPFunc.toString(16));
					const TYPE = await addLeadingZero(teachinData.EEPType.toString(16));
					const MANUFACTURER = Enocean_manufacturer['0x0' + await addLeadingZero( teachinData.mfrID.toString(16)) ];

					const gateway = await this.adapter.getObjectAsync('gateway');
					const baseID = ByteArray.from( gateway.native.BaseID.match(/.{1,2}/g) );

					//Teach-In variations (LRNtype): 0 = without EEP and Manufacturer ID, 1 = with EEP and Manufacturer ID
					if (teachinData.LRNtype === 1 && teachinData.LRNStatus === 0) {
						const type = [0xA5];
						const subTelNum = [0x00];
						const tempId = this.senderID.toUpperCase().match(/.{1,2}/g);
						const receiverID = [];
						for(const b in tempId){
							receiverID.push('0x' + tempId[b]);
						}
						const optionalData = subTelNum.concat(receiverID, [0xFF, 0x00]);
						let data = ByteArray.from();
						data.setValue(parseInt(FUNC, 16), 0, 6);	//FUNC
						data.setValue(parseInt(TYPE, 16), 6, 7);	//TYPE
						data.setValue(2047, 13, 11);	//Manufacturer ID
						data.setValue(1, 24, 1);	//LRN Type
						data.setValue(1, 25, 1);	//EEP Result
						data.setValue(1, 26, 1);	//LRN Result
						data.setValue(1, 27, 1);	//LRN Status
						data.setValue(0, 28, 1);	//LRN Bit
						data = type.concat(data, baseID, 0x00);
						await this.sendData(data, optionalData, 0x01);

						this.adapter.log.info(`EEP A5-${FUNC}-${TYPE} detected for device with ID ${this.senderID}, manufacturer: ${MANUFACTURER}`);
						await createObjects(this, `A5-${FUNC}-${TYPE}`, MANUFACTURER);
					} else if (teachinData.LRNtype === 0) {
						const lrnStatus = ByteArray.from(this.telegram.userData).getValue(27, 1);
						const lrnResult = ByteArray.from(this.telegram.userData).getValue(26, 1);
						const eepResult = ByteArray.from(this.telegram.userData).getValue(25, 1);
						this.adapter.log.debug(`LRN Status: ${lrnStatus}, LRN Result: ${lrnResult}, EEP Result: ${eepResult} The ID is "${this.senderID}"`);
						this.adapter.log.info(`Teach-In: 4BS (A5) Telegram without EEP and manufacturer ID detected, you have to add this device manually. The ID is "${this.senderID}"`);
					} else if (teachinData.LRNStatus === 0) {
						const type = [0xA5];
						const subTelNum = [0x00];
						const tempId = this.senderID.toUpperCase().match(/.{1,2}/g);
						const receiverID = [];
						for(const b in tempId){
							receiverID.push('0x' + tempId[b]);
						}
						const optionalData = subTelNum.concat(receiverID, [0xFF, 0x00]);
						let data = ByteArray.from([0x00, 0x00, 0x00, 0x00]);
						data.setValue(1, 24, 1);	//LRN Type
						data.setValue(1, 25, 1);	//EEP Result
						data.setValue(1, 26, 1);	//LRN Result
						data.setValue(1, 27, 1);	//LRN Status
						data.setValue(0, 28, 1);	//LRN Bit
						data = type.concat(data, baseID, 0x00);
						await this.sendData(data, optionalData, 0x01);
					}
				}
				break;
			}
			case RPS: {
				const t21 = ByteArray.from(this.telegram.status).getValue(2, 1);
				const nu = ByteArray.from(this.telegram.status).getValue(3, 1);

				switch (t21 && nu) {
					case (1 && 1):    //EEP F6-02-xx
						await createObjects(this, 'F6-02-02', 'Enocean GmbH');
						this.adapter.log.info('EEP F6-02-xx detected and added to devices');
						break;
					case (0 && 1):    //EEP F6-03-xx
						await createObjects(this, 'F6-02-02', 'Enocean GmbH');
						this.adapter.log.info('EEP F6-03-xx detected and added to devices');
						break;
					case (1 && 0):    //EEP F6-10-xx
						this.adapter.log.info('EEP F6-10-xx detected, please add device manual');
						break;
				}

				this.adapter.log.info(`Teach-In: RPS (F6) Telegram detected, you have to add this device manually if it wasn't added right now. The ID is "${this.telegram.senderID}"`);

				break;
			}
			case UTE: {
				//this.adapter.log.info(`Teach-In: UTE (D4) Telegram detected, you have to add this device manually. The ID is "${this.senderID}"`);
				const teachinData = new UTETeachIn(this.telegram.userData);
				const mfr8LSB = await addLeadingZero( teachinData.IDLSB );
				const mfr3MSB = await addLeadingZero( teachinData.IDMSB );
				const TYPE = await addLeadingZero( teachinData.EEPType );
				const FUNC = await addLeadingZero( teachinData.EEPFunc );
				const RORG = await addLeadingZero( teachinData.EEPRorg );
				const channels = await addLeadingZero( teachinData.channels );

				const gateway = await this.adapter.getObjectAsync('gateway');
				const baseID = ByteArray.from( gateway.native.BaseID.match(/.{1,2}/g) );

				const obj = await this.adapter.getObjectAsync(this.senderID);
				if (obj && (teachinData.request === 2 || teachinData.request === 1)) { //Teach-out
					const type = [0xD4];
					const subTelNum = [0x01];
					const tempId = this.senderID.toUpperCase().match(/.{1,2}/g); //device address who will receive the response
					const receiverID = []; //tempId has to be split into array for usage

					for (const b in tempId) {
						receiverID.push('0x' + tempId[b]);
					}

					const optionalData = subTelNum.concat(receiverID, [0xFF, 0x00]); //building optional data array

					let data = ByteArray.from([0x00, channels, mfr8LSB, 0x00, TYPE, FUNC, RORG ]); //initialize data array//initialize data array
					data.setValue(teachinData.communication, 0, 1);	//Communication type Uni-/Bi-directional (0/1)
					data.setValue(2, 2, 2);	//Request type
					data.setValue(1, 4, 4);	//Command identifier
					data.setValue(mfr3MSB, 29, 3);	//Manufacturer-ID (3 MSB)
					data = type.concat(data, baseID, 0x00);

					await this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
					await this.sendData(data, optionalData, 0x01);
					await deleteDevice(this, this.senderID);

				} else if ( (teachinData.request === 2 || teachinData.request === 0) && teachinData.response === 0 && (teachinData.communication === 1 || teachinData.communication === 0) ) { 	//Bidirectional Teach-in/-out request with response
					const type = [0xD4];
					const subTelNum = [0x01];
					const tempId = this.senderID.toUpperCase().match(/.{1,2}/g); //device address who will receive the response
					const receiverID = []; //tempId has to be split into array for usage

					for (const b in tempId) {
						receiverID.push('0x' + tempId[b]);
					}

					const optionalData = subTelNum.concat(receiverID, [0xFF, 0x00]); //building optional data array

					let data = ByteArray.from([0x00, channels, mfr8LSB, 0x00, TYPE, FUNC, RORG ]); //initialize data array
					data.setValue(teachinData.communication, 0, 1);	//Communication type Uni-/Bi-directional (0/1)
					data.setValue(1, 2, 2);	//Request type
					data.setValue(1, 4, 4);	//Command identifier
					data.setValue(mfr3MSB, 29, 3);	//Manufacturer-ID (3 MSB)
					data = type.concat(data, baseID, 0x00);

					await this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
					await this.sendData(data, optionalData, 0x01);
					await createObjects(this, `${RORG}-${FUNC}-${TYPE}`, Enocean_manufacturer[`0x0${mfr8LSB}`]);

				} else if ( (teachinData.request === 2 || teachinData.request === 0) && teachinData.response === 1 && (teachinData.communication === 1 || teachinData.communication === 0) ) { //Bidirectional Teach-in/-out request without response
					await createObjects(this, `${RORG}-${FUNC}-${TYPE}`, Enocean_manufacturer[`0x0${mfr8LSB}`]);
				}

				//this.adapter.log.info(`Universal Teach-in: Communication: ${teachinData.communication}, Teach-In-Response: ${teachinData.response}, Teach-in-Request: ${teachinData.request}, Command: ${teachinData.cmd}, Channels: ${teachinData.channels}, MFR8LSB: ${mfr8LSB.toString(16)}, MFR3MSB: ${mfr3MSB.toString(16)}, RORG: ${RORG.toString(16)}, FUNC: ${FUNC.toString(16)}, TYPE: ${TYPE.toString(16)}`);
				break;
			}
			case OneBS: {
				const teachinData1BS = new OneBSTeachIn(this.telegram.userData);

				if (teachinData1BS.teachIn === 0) {
					this.adapter.log.info(`Teach-In: 1BS (D5) Telegram detected, you have to add this device manually. The ID is "${this.senderID}"`);
				}
				break;
			}
			case VLD:
				this.adapter.log.info(`Teach-In: VLD (D2) Telegram detected, you have to add this device manually. The ID is "${this.senderID}"`);
				break;
			case SmartACK:
				this.adapter.log.info(`Teach-In: Smart Ack Learn Request (C6) Telegram detected, you have to add this device manually. The ID is "${this.senderID}"`);
				break;
			case MSC: {
				const teachinData = new MSCTelegram(this.telegram.userData);
				const mfr = teachinData.mfrID;

				const gateway = await this.adapter.getObjectAsync('gateway');
				const baseID = gateway.native.BaseID;
				const offset = gateway.native.BaseID_offset;

				if (mfr === 'D') {  //check if manufacturer is Eltako
					await addEltakoDevice(this, baseID, offset);
				} else {
					this.adapter.log.info(`Teach-In: MSC (D1) Telegram detected, you have to add this device manually. The ID is "${this.senderID}" and the manufacturer is ${Enocean_manufacturer['0x0' + mfr]}`);

				}
				break;
			}

		}
	}

}

class manualTeachIn {
	/**
	 *
	 * @param {object} that
	 * @param {string} eep
	 * @param {string} mfr
	 * @param {string} id
	 * @param {string} name
	 * @param {string} baseIDoffset
	 * @param {string} broadcast
	 */
	constructor(that, eep, mfr, id, name, baseIDoffset, broadcast){
		this.adapter = that;
		this.eep = eep;
		this.mfr = mfr;
		this.senderID = id;
		this.name = name;
		this.IDoffset = baseIDoffset;
		this.broadcast = broadcast;

		this.main.bind(this);

		this.main();

	}

	async main(){
		await createObjects(this, this.eep, this.mfr);
	}

}

class predefinedDeviceTeachIn {
	/**
	 *
	 * @param {object} that
	 * @param {string} device
	 * @param {string} mfr
	 * @param {string} id
	 */
	constructor(that, device, mfr, id){
		this.adapter = that;
		this.device = device;
		this.mfr = mfr;
		this.senderID = id;

		this.main.bind(this);

		this.main();

	}

	async main(){
		const device = devices[this.mfr][this.device];

		this.name = this.device;
		this.IDoffset = device.id_offset;
		this.broadcast = device.broadcast;

		for (const i in device.EEP){
			await createObjects(this, device.EEP[i], this.mfr);
		}

		if(device.EEP.length > 0){
			await this.adapter.extendObjectAsync(this.senderID.toLowerCase(), {
				'native': {
					eep: device.EEP
				}
			});
		}

	}

}

/**
 *
 * @param {object} _this
 * @param {string} eep
 * @param {string} mfr
 * @returns {Promise<void>}
 */
async function createObjects(_this, eep, mfr){

	eep = eep.toUpperCase();
	_this.adapter.log.info(`Create objects for ${eep} from ${mfr} with id: ${_this.senderID}`);
	if(mfr === null){
		mfr = 'EnOcean GmbH';
	}
	const alias = eep.replace(/-/g, '');
	//Check if profile exists if not abort createObjects
	if(alias === undefined){
		return;
	}

	if (!EEPList[alias]) {
		_this.adapter.log.info(`EEP ${eep} unknown, send this information to developer.`);
		return;
	}
	const obj = await _this.adapter.getObjectAsync(_this.senderID);
	const id = _this.senderID.toLowerCase();

	if (!obj) {
		const deviceObj = {
			type: 'device',
			common: {
				name: _this.name ? _this.name : EEPList[alias].type_title
			},
			native: {
				id: id,
				eep: [
					eep
				],
				manufacturer: mfr
			}
		};

		if (_this.IDoffset) {
			const gateway = await _this.adapter.getObjectAsync('gateway');
			let offset;
			if(gateway.native.BaseID_offset >= 0){
				offset = gateway.native.BaseID_offset + 1;
				const baseID = gateway.native.BaseID;
				deviceObj.native.Sender_ID = await additionID(baseID, offset);
				await _this.adapter.extendObjectAsync('gateway', {
					'native': {
						'BaseID_offset': offset
					}
				});
			}else{
				await _this.adapter.extendObjectAsync('gateway', {
					'native': {
						'BaseID_offset': 0
					}
				});
			}
			deviceObj.native.baseIDoffset = offset;
		}

		await _this.adapter.setObjectNotExistsAsync(id, deviceObj);

		if (_this.broadcast) {
			await _this.adapter.extendObjectAsync(id.toLowerCase(), {
				'native': {
					'broadcast': true
				}
			});
		}

		await _this.adapter.setObjectNotExistsAsync(id + '.rssi', {
			type: 'state',
			common: {
				name: 'Signal Strength',
				role: 'value.rssi',
				type: 'number',
				read: true,
				write: false,
				unit: 'dBm'
			},
			native: {}
		});

	} else {
		const newEEP = obj.native.eep;
		let exists = false;
		for (const e in newEEP) {
			if (newEEP[e] === eep) {
				exists = true;
			}
		}
		if (!exists) {
			newEEP.push(eep);
			await _this.adapter.extendObjectAsync(id.toLowerCase(), {
				native: {
					eep: newEEP
				}
			});
		}

	}

	let cases = [];
	if(EEPList[alias].case.length === undefined){
		cases.push(EEPList[alias].case);
	}else{
		cases = EEPList[alias].case;
	}

	for (const i in cases) {
		const Case = cases[i];
		for (const z in Case) {
			for (const y in Case[z]) {
				if (Case[z][y].shortcut !== undefined && Case[z][y].shortcut !== {} && typeof Case[z][y].shortcut !== 'object' && Case[z][y].iobroker) {
					const shortcut = Case[z][y].shortcut;
					const common = Case[z][y].iobroker;
					common.name = Case[z][y].data;

					await _this.adapter.setObjectNotExistsAsync(id + '.' + shortcut, {
						type: 'state',
						common,
						native: {}
					});
				}

			}
		}
	}
}

/**
 * Invert bit string (normal used for msb)
 * @param {number} bitString
 * @returns {Promise<string>}
 */
async function invertBitString(bitString){
	const inverted = bitString.toString(2).split('').reverse().join('');

	return inverted;
}

/**
 *
 * @param {string} data
 */
async function addLeadingZero(data) {
	if (data.length === 1) {
		return data.padStart(2, '0');
	} else {
		return data;
	}
}

/**
 *
 * @param {object} _this
 * @param {string} deviceId
 * @returns {Promise<void>}
 */
async function deleteDevice(_this, deviceId) {
	await _this.adapter.getObjectListAsync({startkey: _this.adapter.namespace + '.' + deviceId, endkey: _this.adapter.namespace + '.' + deviceId + '.\u9999'})
		.then(async result => {
			for (const r in result.rows) {
				await _this.adapter.delObjectAsync(result.rows[r].id)
					.then(result => {
						//console.log(result);
					}, reject => {
						_this.adapter.log.error(reject);
					});
			}
		}, reject => {
			_this.adapter.log.error(reject);
		});
}

/**
 *
 * @param {string} baseID
 * @param {number} summand
 * @returns {Promise<string>}
 */
async function additionID(baseID, summand){
	const patt = new RegExp(/^0x/);
	if(!patt.test(baseID)) {
		baseID = '0x' + baseID;
	}
	const idDec = parseInt(baseID) + summand;
	return idDec.toString(16);

}

async function addEltakoDevice(_this, baseID, offset) {
	const patt = new RegExp('00d0fe');
	const res = patt.test(_this.telegram.userData);
	if (res) {
		return;
	}
	const devTelegram = _this.telegram.userData.replace('00d0ff', '').toUpperCase();
	const type = [0xA5];
	const subTelNum = [0x01];
	const tempId = _this.senderID.toUpperCase().match(/.{1,2}/g); //device address who will receive the response
	const receiverID = []; //tempId has to be split into array for usage
	for (const b in tempId) {
		receiverID.push('0x' + tempId[b]);
	}
	const optionalData = subTelNum.concat(receiverID, [0xFF, 0x00]); //building optional data array

	const offs = (offset !== undefined) ? parseInt(offset) + 1 : 0;
	const newIDdecimal = await additionID(baseID, offs);
	const newID = ByteArray.from( newIDdecimal.match(/.{1,2}/g) );
	_this.IDoffset = true;

	if (!eltakoDevices[devTelegram]) {
		_this.adapter.log.info('could not identify teachin telegram from Eltako device.');
		return;
	}

	switch(eltakoDevices[devTelegram].name) {
		case 'fhk61-230v': {
			break;
		}
		case 'fkld61': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako FKLD61 detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-13-07`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-13-06`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-13-07', 'TF-13-06']
				}
			});
			break;
		}
		case 'flc61np': {
			break;
		}
		case 'fld61': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako FLD61 detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-13-07`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-13-06`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-13-07', 'TF-13-06']
				}
			});
			break;
		}
		case 'fms61np-230v': {
			break;
		}
		case 'fmz61-230v': {
			break;
		}
		case 'fud61np-230v':
		case 'fud61npn-230v': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako FUD61NPN-230V detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-13-07`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-13-06`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-13-07', 'TF-13-06']
				}
			});

			break;
		}
		case 'fud62npn-ble': {
			break;
		}
		case 'frm60': {
			break;
		}
		case 'fsb61np-230v': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako FSB61NP-230V detected');

			let data = ByteArray.from([0xFF, 0xF8, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-13-03`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-13-04`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-13-03', 'TF-13-04']
				}
			});
			break;
		}
		case 'fsb62-ble': {
			break;
		}
		case 'fsb64': {
			break;
		}
		case 'fsb71-230v': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako FSB61NP-230V detected');

			let data = ByteArray.from([0xFF, 0xF8, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async  () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-13-03`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-13-04`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-13-03', 'TF-13-04']
				}
			});
			break;
		}
		case 'fsb71-2x-230v': {
			break;
		}
		case 'fsb71-24vdc': {
			break;
		}
		case 'fsg71/1-10v': {
			break;
		}
		case 'fsha': {
			break;
		}
		case 'fsr61-230v': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako FSR61 detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-01-02`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-14-02`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-01-02', 'TF-14-02']
				}
			});
			break;
		}
		case 'fsr62-ble': {
			break;
		}
		case 'fsr62np2-ble': {
			break;
		}
		case 'fsr64': {
			break;
		}
		case 'fsr71np-2x-230v': {
			break;
		}
		case 'fsr71np-4x-230v': {
			break;
		}
		case 'fsr71ssr-2x-230v': {
			break;
		}

		case 'ftkb-hg': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako FTKB-hg detected');

			let data = ByteArray.from([0x50, 0x50, 0x16, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `A5-14-0A`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['A5-14-0A']
				}
			});
			break;
		}
		case 'ftn61np-230v': {
			break;
		}
		case 'tf-tax5d': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako TF-TAx5D detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout ( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-01-01`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `F6-02-02`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-01-01', 'F6-02-02']
				}
			});

			break;
		}
		case 'tf-tax5j': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako TF-TAx5J detected');

			let data = ByteArray.from([0xFF, 0xF8, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-01-01`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `F6-02-02`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-01-01', 'F6-02-02']
				}
			});

			break;
		}
		case 'tf-tax5l': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako TF-TAx5L detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-01-01`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `F6-02-02`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-01-01', 'F6-02-02']
				}
			});

			break;
		}
		case 'tf61d-230v': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako TF61D-230V detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-13-07`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `F6-02-02`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-13-07', 'F6-02-02']
				}
			});

			break;
		}
		case 'fta65j':
		case 'fta55j':
		case 'tf61j-230v': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako TF61J-230V / FTA65J / FTA55J detected');

			let data = ByteArray.from([0xFF, 0xF8, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-01-01`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-13-04`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-01-01', 'TF-13-04']
				}
			});

			break;
		}
		case 'tf61l-230v': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako TF61L-230V detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);
			await createObjects(_this, `TF-01-02`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-13-05`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-01-02', 'TF-13-05']
				}
			});

			break;
		}
		case 'tf100d': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako TF100D detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5 * 1000);

			await createObjects(_this, `TF-13-07`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `F6-02-02`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-13-07', 'F6-02-02']
				}
			});

			break;
		}
		case 'tf100l': {
			_this.adapter.setState('gateway.teachin', {val: false, ack: true});
			_this.adapter.log.info('Eltako TF100L detected');

			let data = ByteArray.from([0xE0, 0x40, 0x0D, 0x80]); //initialize data array
			data = type.concat(data, newID, 0x00);
			setTimeout( async () => {
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
				await _this.sendData(data, optionalData, 0x01); //0x01 = Packet Type ERP1
			}, 5* 1000);
			await createObjects(_this, `TF-01-02`, Enocean_manufacturer[`0x00D`]);
			await createObjects(_this, `TF-13-05`, Enocean_manufacturer[`0x00D`]);

			await _this.adapter.extendObjectAsync(_this.senderID.toLowerCase(), {
				'native': {
					'eep': ['TF-01-02', 'TF-13-05']
				}
			});

			break;
		}
	}
}


module.exports = {
	handleType1: handleType1,
	handleType2: handleType2,
	handleTeachIn: handleTeachIn,
	manualTeachIn: manualTeachIn,
	predifnedDeviceTeachin: predefinedDeviceTeachIn
};
