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

//const parseMessage = require('./ESP2Packet');
const telegramTransformer = require('./ESP2_TelegramTransformer');
const logger = require('./myLogging');
logger.setLoglevel("debug") // change log level to debug need only once for all loggers, its singleton

/**
 * Class to present the connection to the FGW
 */
class connectionFGW extends EventEmitter {

  // private fields
  #path = "/dev/ttyS0";   // for the path / port
  #baudRate = 57600;      // for the baudrate

  #myPort = null;


    // private fields
    #path = "/dev/ttyS0";   // for the path / port
    #baudRate = 57600;      // for the baudrate
    #connected = false;     // we are connected to the FGW14
    //#myPort = serialport( this.#path, this.#baudRate)
    #myPort = serialport
    #myParser = new telegramTransformer()

	/**
     * Constructor of this class
     *
	 * @param {portName} path of the serial port you want to open. For example, /dev/ttyXXX
 	 * @param {baudRate} number of the baudrate of the port you want to open. For example, 57600
	 */
   constructor( portName, baudRate ) {
        try{
            this.testing = 'test';
            if ( portName ) {
                this.#path = portName;
            }
            if ( baudRate ) {
                this.#baudRate = baudRate;
            }
            this.#connected = false;

        } catch (err){
            logger.error(err);
        }

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
    get path(){
        return this.#path;
    }

	/**
	 * Getter for the connected state of the FGW
	 */
    get connected(){
        return this.#connected;
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
    get baudRate(){
        return this.#baudRate;
    }

	/**
	 * Function to change the connection state
     *
	 * @param {state} Bool if the connection is true or false
	 */
    connectionState = ( state ) => {
        try{
            this.#connected = state;
            logger.info( 'connectionState:connected=' + this.#connected );
        } catch (err){
            logger.error(err);
        }
    }   // end of method connectionState

	/**
	 * Function to open the connection
	 */
    openConnection(){
        try{
            // define callbacks

            // callback if connection has opened
            let cb_onOpen = ( error ) => {
                try{
                    if( error ){
                        logger.info(error);
                        this.connectionState( false )
                    }
                    logger.info('Open connection done!');
                    this.connectionState( true )
                } catch (err){
                    logger.error(err);
                }
            }

            // callback if connection received data
            let cb_onData = ( data ) => {
                try{
                    logger.info('on Data \r\n' + data + '\r\n geparst:' );
                } catch (err){
                    logger.error(err);
                }
            }

            // callback if connection has closed
            let cb_onClose = ( msg ) => {
                try{
                    logger.info('Close connection done!' + msg);
                    this.connectionState( false )
hier wie auch in onError
neuer Verbindungsversuch über
https://javascript.info/settimeout-setinterval
https://www.codota.com/code/javascript/functions/clearTimeout
als "Nested setTimeout" und soll dann this.openConnection alle x ms aufrufen
                } catch (err){
                    logger.error(err);
                }
            }

            // callback if connection has error
            let cb_onError = ( error ) => {
                try{
                    if( error ){
                        logger.info(error);
                        this.connectionState( false )
                    }
                    logger.info('Error connection=' + error);
                    this.connectionState( false )
                } catch (err){
                    logger.error(err);
                }
            }

//            // define connection and open it
//            this.#myPort = serialport( this.#path, {
//                baudRate: this.#baudRate
//            });

            // define connection and open it
            logger.info('define connection=' + this.#path);
            this.#myPort = serialport( this.#path, {
                baudRate: this.#baudRate,
                "disconnectedCallback": function () {
                    logger.info("DEVICE: Disconnected.");
                    }
            }, false);

//##################
//https://github.com/serialport/node-serialport/issues/388
//https://github.com/serialport/node-serialport/pull/393
//https://github.com/serialport/node-serialport/issues/388#issuecomment-57752182
//https://github.com/pimatic/pimatic/issues/222
//
//
//var port = new com(comName, {
//         baudrate: _baudrate,
//         "disconnectedCallback": function () {
//         console.log("DEVICE: Disconnected.");
//         //call the next function or whatever
//        }
//}, false);
//##################

            this.#myPort.pipe( this.#myParser );
            this.#myPort.on( 'open', cb_onOpen );
            this.#myParser.on( 'data', cb_onData );
            this.#myPort.on( 'close', cb_onClose );
            this.#myPort.on( 'error', cb_onError );
            this.#connected = false;



        } catch (err){
            logger.error(err);
        }

    }   // end of method openConnection

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

	/**
	 * Function to check if the connection is working
	 */
    checkConnection(){
        try{
            logger.debug('Check connection!#############');

        } catch (err){
            logger.error(err);
        }

    }   // end of method checkConnection

}   // end of class connectionFGW





//
//####################
//
//
//SerialPort Version: V5.0.0
//NodeJS Version: V6.3.0
//Operating System: WIN 10 64B
//
//Hello,
//Accordding to my last question close event never fire. I was unabled to detected if the COM is disconnected so I have created my own way to detect it.
//
//I have created timestamp, and checked it with interval() every 1 sec to see if is connected.
//when it's detect the COM is unplugged I have try to re-establish the connection be re-instance port with SerialPort like you'll see inside the code below.
//When its try to reconnect I've get Error: Access denied.
//there is a way to refresh or clean the cache, because I think the server still hold the connection when isn't closed propely.
//
//I've also tried port.close() and it's throw me: Error: Port is not open.
//
//var comPort = '\\\\.\\COM7',
//    lastDataTime,
//    lastresult,
//    count = 0,
//    lastDataTime,
//    comStatus,
//    error;
//var port = new SerialPort(comPort, function (err) {
//    if (err) {
//        comStatus = false;
//        return console.log('Error: ', err.message);
//    }
//});
//const parser = port.pipe(new Readline());
//port.on('open', function () {
//    console.log('~Port is open.');
//
//    parser.on('data', function (data) {
//        comStatus = true;
//        lastDataTime = Date.now();
//        if (++count == 10) {
//            count = 0;
//            lastresult = data;
//        }
//    });
//});
//
//setInterval(function () {
//    if (Date.now() - lastDataTime > 1000 || !comStatus) {
//        comStatus = false;
//        port.close();
//        port = new SerialPort(comPort, function (err) {
//            if (err) {
//                error = 'Error: ' + err.message;
//                return console.log(error);
//            }
//        });
//    }
//}, 1000);
//
//
//app.get('/', function (req, res) {
//    res.send((comStatus) ? lastresult : 'Disconnected - ' + error);
//    console.log(lastresult);
//})
//
//Thanks!
//
//
//
//
//####################
//
//
//const SerialPort = require('serialport')
//const Readline = require('@serialport/parser-readline')
//const port = new SerialPort('/dev/tty-usbserial1')
//const parser = new Readline()
//port.pipe(parser)
//parser.on('data', console.log)
//port.write('ROBOT PLEASE RESPOND\n')
//
//
//

##########################


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
