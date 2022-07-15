"use strict";

/**
 * Imports
 */
const serialport = require('serialport');
//const EventEmitter = require('events.EventEmitter');
const EventEmitter = require('events').EventEmitter
//import {EventEmitter} from 'events';


/*
import {EventEmitter} from 'events';

export class Job extends EventEmitter {
  constructor() {
    super();
  }
}

let job = new Job();
#####################


const events        = require('events')

class EventManager extends events.EventEmitter {
    constructor() { super() }
}

const instance = new EventManager()

module.exports = instance

####################

const EventManager = require('./EventManager')
const processTask  = require('./processTask')

EventManager.on('startTask', (task) => {
    processTask(task)
})

EventManager.on('endTask', (task) => {
    //some code
})

const someTask = {}
EventManager.emit('startTask', someTask)

*/

/**
 * Class to present the connection to the FGW
 */
class connectionFGW extends EventEmitter {

  // private fields
  #path = "/dev/ttyS0";   // for the path / port
  #baudRate = 57600;      // for the baudrate

  #myPort = null;


	/**
	 * @param {portName} path of the serial port you want to open. For example, /dev/ttyXXX
 	 * @param {baudRate} number of the baudrate of the port you want to open. For example, 57600
	 */
   constructor( portName, baudRate ) {

      super();
      //events.EventEmitter.call(this);


      try {
    //    #myPort = new serialport( this.#path, this.#baudRate )

       this.testing = 'test';

       if ( portName ) {
           this.#path = portName;
       }
       if ( baudRate ) {
           this.#baudRate = baudRate;
       }

       this.#myPort = new serialport( this.#path, {
                                      baudRate: this.#baudRate
                                    })

        console.log( "testConstructor" );

        // this.#myPort.on('error', function (e) {
        //                   this.log.error('connectionFGW error "serialport": ' + e);
        //                 });
        this.#myPort.on("error", function(err){
                        //throw new Error("Unable to connect serial port  ? " + this.#path);
                        //this.log.info('Unable to connect serial port`);: ' + this.#path);
                        var err = new Error("serialport" + err);
                        this.emit("error", err);

                        hier mal mit setTimeout(function () ausprobieren ???);
                      })


      } catch (e) {
        //this.log.error('connectionFGW error "constuctor": ' + e);
        var err = new Error("serialport" + err);
        this.emit("error", err);
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
      try {
    //    #myPort = new serialport( this.#path, this.#baudRate )


        // define serial port
        this.#myPort = new serialport( this.#path, {
            baudRate: this.#baudRate,
            parser: new serialport.parsers.Readline('\r\n')
        });
        this.#myPort.on('open', this.onOpen);
        this.#myPort.on('data', this.onData);
        //console.log('Open connection done!');

      } catch (e) {
        this.log.error('connectionFGW error "openConnection": ' + e);
      }

    }   // end of function openConnection

	/**
	 * Function to close the connection
	 */
    close(){
      if ( this.#myPort ) {
        this.#myPort.close()
      }
    }

	/**
	 * Getter for the baudRate
	 */
    get isOpen() {
      if ( this.#myPort ) {
        return this.#myPort.isOpen;
      }
    }

	/**
	 * Function to call if connection has opened
	 */
    onOpen(){
        console.log('Open connection:' + this.#path );

    }   // end of function onOpen

	/**
	 * Function to call if connection received data
	 */
    onData(data){
        console.log('on Data \r\n' + data + '\r\n geparst:' );
        parseMessage(data);

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
