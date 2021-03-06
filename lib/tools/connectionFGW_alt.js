

/**
 * Imports 
 */
var serialport = require('serialport');
var parseMessage = require('./ESP2Packet');

/**
 * Class to present the connection to the FGW 
 */
class connectionFGW {


    // private fields
    #path = "/dev/ttyS0";   // for the path / port
    #baudRate = 57600;      // for the baudrate
    #myPort = serialport( this.#path, this.#baudRate)

	/**
	 * @param {portName} path of the serial port you want to open. For example, /dev/ttyXXX
	 */
	constructor( portName, baudRate ) {
        this.testing = 'test';
        if ( portName ) {
            this.#path = portName;
        }
        if ( baudRate ) {
            this.#baudRate = baudRate;
        }
    }

	/**
	 * Setter for the path
	 */
    set path( newPath ) {
    this.#path = newPath;
    }

	/**
	 * Getter for the path
	 */
    get path() {
    return this.#path;
    }

	/**
	 * Setter for the baudRate
	 */
    set baudRate( newBaudRate ) {
    this.#baudRate = newBaudRate;
    }

	/**
	 * Getter for the baudRate
	 */
    get baudRate() {
    return this.#baudRate;
    }

	/**
	 * Function to open the connection
	 */
    openConnection(){
        // define serial port
        this.#myPort = serialport( this.#path, {
            baudRate: this.#baudRate,
            parser: new serialport.parsers.Readline('\r\n')
        });
        this.#myPort.on('open', this.onOpen);
        this.#myPort.on('data', this.onData);
        console.log('Open connection done!');

    }   // end of function openConnection

	/**
	 * Function to call if connection has opened
	 */
    onOpen = function (){
        console.log('Open connections!');

    }   // end of function onOpen

	/**
	 * Function to call if connection received data
	 */
    onData = function (data){

hier wohl den TelegramTransformer verwenden



        console.log('on Data \r\n' + data + '\r\n geparst:' );
        console.log(parseMessage(data));

    }   // end of function onData

}   // end of class connectionFGW



//
//####################
//
///**
// * Represents a packet received from the ESP3 serial interface
// */
//class ESP3Packet {
//
//	/**
//	 * @param {Buffer} rawData The raw data to construct this packet from
//	 */
//	constructor(rawData) {
//
//		// 2 bytes at position 1 => data length
//		this.dataLength 	= rawData.readUInt16BE(1);
//		this.optionalLength = rawData[3];
//		this.type 			= rawData[4];
//		this.data 			= rawData.slice(6, 6 + this.dataLength);
//		this.optionalData 	= rawData.slice(6 + this.dataLength, 6 + this.dataLength + this.optionalLength);
//	}
//
//ccccccccccccccccccccccccccc
//
//var serialport = require('serialport');
//var portName = "/dev/ttyUSB0";
//
//var myPort = new serialport(portName, {
//    baudRate: 57600,
//    parser: new serialport.parsers.Readline('\r\n')
//});
//
//myPort.on('open', onOpen);
//myPort.on('data', onData);
//
//function onOpen(){
//    console.log('Open connections!');
//}
//
//function onData(data){
//    console.log('on Data \r\n' + data + '\r\n geparst:' );
//    parseMessage(data);
//
//}
//###################
//
//class Rectangle {
//  constructor(height, width) {
//    this.height = height;
//    this.width = width;
//  }
//  // Getter
//  get area() {
//    return this.calcArea();
//  }
//  // Method
//  calcArea() {
//    return this.height * this.width;
//  }
//}
//
//const square = new Rectangle(10, 10);
//
//console.log(square.area); // 100
//
//##########################
//
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
//
//
//
//


// export the instance of the connection to be sure to get only one instance
// Singleton Pattern - Node.JS like
// it is called cached singleton in Node.JS 
//
// the use of the class did not need the new() command
//  like:
//      const object = connectionFGW;
//  not like:
//      const object = new connectionFGW();
//
//  - not more use of singleton - maybe more than one instances of the adapter possible
//
//  module.exports = new connectionFGW();


module.exports = connectionFGW;
