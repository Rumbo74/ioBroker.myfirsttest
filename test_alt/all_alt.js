const path = require('path');

//const readline = require('readline')
//
//const rl = readline.createInterface({
//  input: process.stdin,
//  output: process.stdout
//})

//const question = prompt => {
//  return new Promise((resolve, reject) => {
//    rl.question(prompt, resolve)
//  })
//}


//( async () => {
//  const nameAnswer = await question('What is your name??')
//  console.log(`Nice to meet you, ${nameAnswer}.`)
//
//  const whereAnswer = await question('Where are you from?')
//  console.log(`I hear it's nice in ${whereAnswer}.`)


//    // using assert passed to the test function that just logs failures
//    exports['test that logs all failures'] = function(assert) {
//      assert.equal(2 + 2, 5, 'assert failure is logged')
//      assert.equal(3 + 2, 5, 'assert pass is logged')
//    }
//
//    if (module == require.main) require('test').run(exports)
//

    // test USB
//    var usb = require('usb')
//
//    const usbDevs = usb.getDeviceList();
//    console.log(`Liste aller USB Geräte: `)
//    usbDevs.forEach(dev => {
//            console.log(dev);
//        });

//    var shell = require('shelljs');
//
//    getUsb = function() {
//          this.usbJson = JSON.parse(shell.exec('lsblk --json', {silent:true}).stdout);
//          var dev = this.usbJson.blockdevices;
//          var devices = [];
//          dev.forEach(function(entry) {
//              entry.children.forEach(function(e) {
//                  devices.push(e.mountpoint);
//              });
//              entry.children.forEach(function(e) {
//                  devices.push(e.deviceDescriptor);
//              });
//
//
//          });
//          return devices;
//    }
//
//    tmpUsb = getUsb();
//
//    console.log(`Liste aller USB Geräte: `)
//    tmpUsb.forEach(dev => {
//            console.log(dev);
//        });


//    var usb = require('usb')
//    usb.on('attach', function(device) {
//        console.log(`USB eingesteckt.`)
//        console.log(`${device.busNumber}`)
//        console.log(`${device.deviceAddress}`)
//        console.log(`${device.portNumbers}`)
//        console.log(`${device.deviceDescriptor}`)
//        console.log(`${device.configDescriptor}`)
//        console.log(`${device.allConfigDescriptors}`)
//        return;
//        });

//
//    listUsb = usb.getDeviceList();
//    console.log(`2. Liste aller USB Geräte: `)
//    listUsb.forEach(device => {
//            console.log(device);
//            console.log(`${device.busNumber}`)
//            console.log(`${device.deviceAddress}`)
//            console.log(`${device.portNumbers}`)
//            console.log(`${device.configDescriptor}`)
//            console.log(`${device.configDescriptor.bLength}`)
//            console.log(`${device.configDescriptor.bDescriptorType}`)
//            console.log(`${device.configDescriptor.wTotalLength}`)
//            console.log(`${device.configDescriptor.bNumInterfaces}`)
//            console.log(`${device.configDescriptor.bConfigurationValue}`)
//            console.log(`${device.configDescriptor.iConfiguration}`)
//            console.log(`${device.configDescriptor.bmAttributes}`)
//            console.log(`${device.configDescriptor.bMaxPower}`)
//            console.log(`${device.configDescriptor.extra }`)
//        });
//
//  rl.close()




//INFO
//var serialPort = require('serialPort');
//var io = require('socket.io').listen(3000);
//
//var serialPort = new serialPort("COM4", {
//    baudRate: 9600,
//    parser: new serialPort.parsers.Readline("\n")
//});
//
//io.sockets.on('connection', function(socket){
//    socket.on('message', function(msg){
//        console.log(msg);
//    });
//
//    socket.on('disconnected', function(){
//        console.log('disconnected');
//    });
//});
//
//var clearData = "";
//var readData = "";
//
//serialPort.on('open',function(){
//    console.log('open');
//    serialPort.on('data', function(data){
//        console.log(data);
//        readData += data.toString();
//        io.sockets.emit('message',data);
//    });
//});
//
//This is the code that I have in Arduino, it's just a short example.
//
//void setup() {
//  // put your setup code here, to run once:
//Serial.begin(9600);
//}
//
//void loop() {
//  // put your main code here, to run repeatedly:
//Serial.println("Hello");
//delay(2000);
//}
//
//
//#######################################
//var recVal = '';
//mySerial.on('data', function(data) {
//  if(data.indexOf('\n') != -1) {
//    io.emit('serial:data', {
//      value: recVal
//    });
//    console.log("Data: ", recVal.toString());
//    recVal = '';
//  } else {
//    recVal = recVal.concat(data);
//  }
//});
//
//
//
//})()


/*

##################################


var BaudRate = 9600;
var ServerPort = 8080;
var DocumentPath = "c:/node";

var fs = require("fs");
var readline = require('readline');
var rl = readline.createInterface({
 input : fs.createReadStream('server_config.txt'),
 output: process.stdout,
 terminal: false
})

rl.on('line',function(line){
 console.log(line) // parse line
})
var express = require('express');
 io = require('socket.io'), // include socket.io package
 app = express(), // make an instance of express.js module
 //server = app.listen(8080), // start a server on the port
 server = app.listen(ServerPort), // start a server on the port
 socketServer = io(server); // create a socket server using the express server



//initialize serial port initialization

var serialport = require('serialport'), // include the serialport package
 SerialPort = serialport.SerialPort,    // make a local instance of serial port package
 portName = process.argv[2], // retrieve the port name from the command line argument
 portConfig = {
 //baudRate: 9600,
 baudRate: BaudRate,
 // call myPort.on('data') when a newline is received:
 parser: serialport.parsers.readline('\n')
 };

// open the serial port
var myPort = new SerialPort(portName, portConfig);
//set up server and socketServer listener functions:
//app.use(express.static('d:/sp')); // serve files from the public folder
app.use(express.static(DocumentPath)); // serve files from the public folder
//app.use(express.static('c:/xampp/htdocs'));
app.get('/:name', serveFiles); // listener for all static file requests
socketServer.on('connection', openSocket);     // listener for websocket data


function serveFiles(request, response) {
 var fileName = request.params.name; // get the file name from the request
 response.sendFile(fileName);  // send the file
 //res.sendFile('d:/sp/'+fileName , { root : __dirname});
}

function openSocket(socket){
 console.log('new user address: ' + socket.handshake.address);
 // send something to the web client with the data:
 socket.emit('message', 'Server listening on address : ' + socket.handshake.address);
 // this function runs if there's input from the client:
 socket.on('message', function(data) {
 myPort.write(data); // send the data to the serial device
 });


 // this function runs if there's input from the serialport:
 myPort.on('data', function(data) {
 socket.emit('message', data); // send the data to the client
 });



//
//
//
//##############################

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var sp = new SerialPort("/dev/ttyACM0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

function write() //for writing
{
    sp.on('data', function (data)
    {
        sp.write("Write your data here");
    });
}

function read () // for reading
{
    sp.on('data', function(data)
    {
        console.log(data);
    });
}

sp.on('open', function()
{
    // execute your functions
    write();
    read();
});


*/

/*
##################
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var sp = new SerialPort("/dev/ttyACM0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

function write() //for writing
{
    sp.on('data', function (data)
    {
        sp.write("Write your data here");
    });
}

function read () // for reading
{
    sp.on('data', function(data)
    {
        console.log(data);
    });
}

sp.on('open', function()
{
    // execute your functions
    write();
    read();
});

#####################

var serialPort = require("serialport");

// list serial ports:
serialPort.list().then(ports => {
	ports.forEach((item)=>{
        console.log(item.comName);
        console.log(item.pnpId);
        console.log(item.manufacturer);
	});

});
#######################
"PortInfo.comName" has been deprecated. You should now use "PortInfo.path". The property will be removed in the next major release.
/dev/ttyAMA0
undefined
undefined
/dev/ttyUSB0
usb-FTDI_FT232R_USB_UART_A506H5OF-if00-port0
FTDI


57600
################################################




var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var sp = new SerialPort("/dev/ttyUSB0", {
  baudrate: 57600,
  parser: serialport.parsers.Readline("\n")
});

function write() //for writing
{
    sp.on('data', function (data)
    {
        sp.write("Write your data here");
    });
}

function read () // for reading
{
    sp.on('data', function(data)
    {
        console.log(data);
    });
}

sp.on('open', function()
{
    // execute your functions
//    write();
    read();
});


################################################


		if (this.config.serialport) {
			SERIAL_PORT = new SerialPort(this.config.serialport, { baudRate: 57600});
			SERIALPORT_ESP3_PARSER = SERIAL_PORT.pipe(new SERIALPORT_PARSER_CLASS());
			await this.packetListener();
		}


	// list serial ports
	listSerial() {
		let result;

		if (PLATFORM === 'linux' || PLATFORM === 'darwin') {
			// Filter out the devices that aren't serial ports
			const devDirName = '/dev';

			let ports;
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
				this.log.error('Cannot read "' + devDirName + '": ' + e);
				ports = [];
			}
			result = ports.map(p => p.path);
		} else if (PLATFORM === 'win32') {
			result = AVAILABLE_PORTS;
		}
		return result;
	}


  	async packetListener() {
  		//open serial port, set adapter state to connected and wait for messages
  		SERIAL_PORT.on('open', async () => {
  			this.setState('info.connection', true, true);
  			await this.getGatewayInfo();
  			this.sendQueue();

  			SERIALPORT_ESP3_PARSER.on('data', (data) => {
  				this.parseMessage(data);
  			});
  		});


      	/**
      	 * Parses a data package from the ESP3 serial interface
      	 * @param {Buffer} data The received data
      	 * /
      	async parseMessage(data) {
      		this.log.debug(data.toString('hex'));
      		const esp3packet = new ESP3Packet(data);

      		switch (esp3packet.type) {
      			case 1: // RADIO_ERP1
      			{
      				const teachin = await this.getStateAsync(this.namespace + '.gateway.teachin');

      				if (teachin) {
      					if (teachin.val === false) {
      						const telegram = new HandleType1(this, esp3packet);
      						await this.setStateAsync('gateway.lastID', telegram.senderID);
      					} else if (teachin.val === true) {
      						const telegram = new RadioTelegram(esp3packet);
      						await this.setStateAsync('gateway.lastID', telegram.senderID);
      						if (teachinMethod === 'UTE'){
      							new HandleTeachIn(this, esp3packet);
      						}else if (telegram.type.toString(16) === teachinMethod.toLowerCase()){
      							new HandleTeachIn(this, esp3packet);
      						}
      					}
      				}

      				break;
      			}
      			case 2: //RESPONSE
      			{
      				//new HandleType2(this, ESP3Packet);
      				this.log.debug('Packet type 2 received: ' + toHex(esp3packet.type));
      				break;
      			}
      			case 3: //RADIO_SUB_TEL
      				this.log.debug('Radio sub telegram received.');
      				break;
      			case 4: //EVENT
      				this.log.debug('Event message received.');
      				break;
      			case 5: //COMMON_COMMAND
      				this.log.debug('Common command received.');
      				break;
      			case 6: //SMART_ACK_COMMAND
      				this.log.debug('Smart Ack command received.');
      				break;
      			case 7: //REMOTE_MAN_COMMAND
      				this.log.debug('Remote management command received.');
      				break;
      			case 9: //RADIO_MESSAGE
      				this.log.debug('Radio message received.');
      				break;
      			case 10: //RADIO_ERP2
      				this.log.debug('ERP2 protocol radio telegram received.');
      				break;
      			case 16: //RADIO_802_15_4
      				this.log.debug('802_15_4_RAW Packet received.');
      				break;
      			case 17: //COMMAND_2_4
      				this.log.debug('2.4 GHz Command received.');
      				break;
      			default:
      				this.log.debug('Packet type ' + toHex(ESP3Packet.type) + ' has been received, but is not handled.');
      				break;
      		}
      	}

*/

// structured representation for ESP3 packets
const ESP3Packet = require('../lib/tools/ESP3Packet').ESP3Packet;
const ResponseTelegram = require('../lib/tools/ESP3Packet').ResponseTelegram;
const RadioTelegram = require('../lib/tools/ESP3Packet').RadioTelegram;
const SERIALPORT_PARSER_CLASS = require('../lib/tools/Serialport_parser');
const CRC8 = require('../lib/tools/CRC8.js');
const ByteArray = require('../lib/tools/byte_array');
const HandleType1 = require('../lib/tools/Packet_handler').handleType1;
const HandleType2 = require('../lib/tools/Packet_handler').handleType2;
const HandleTeachIn = require('../lib/tools/Packet_handler').handleTeachIn;
const ManualTeachIn = require('../lib/tools/Packet_handler').manualTeachIn;


// convert byte to hex
function toHex(byte) {
	return ('0' + (byte & 0xFF).toString(16)).slice(-2);
}

function dec2hexString(dec) {
	return (dec+0x10000).toString(16).substr(-4).toUpperCase();
}


async function parseMessage(data) {
  console.log(data.toString('hex'));
  const esp3packet = new ESP3Packet(data);


	console.log(esp3packet.dataLength);
	console.log(esp3packet.optionalLength);
	console.log(esp3packet.type);
	console.log(esp3packet.data);
	console.log(esp3packet.optionalData);

	// console.log(esp3packet.dataLength.toString('hex'));
	// console.log(esp3packet.optionalLength.toString('hex'));
	// console.log(esp3packet.type.toString('hex'));
	// console.log(esp3packet.data.toString('hex'));
	// console.log(esp3packet.optionalData.toString('hex'));

  switch (esp3packet.type) {
    case 1: // RADIO_ERP1
    {
      const teachin = await this.getStateAsync(this.namespace + '.gateway.teachin');

      if (teachin) {
        if (teachin.val === false) {
          const telegram = new HandleType1(this, esp3packet);
          await this.setStateAsync('gateway.lastID', telegram.senderID);
        } else if (teachin.val === true) {
          const telegram = new RadioTelegram(esp3packet);
          await this.setStateAsync('gateway.lastID', telegram.senderID);
          if (teachinMethod === 'UTE'){
            new HandleTeachIn(this, esp3packet);
          }else if (telegram.type.toString(16) === teachinMethod.toLowerCase()){
            new HandleTeachIn(this, esp3packet);
          }
        }
      }

      break;
    }
    case 2: //RESPONSE
    {
      new HandleType2(this, data);
      console.log('Packet type 2 received: ' + toHex(esp3packet.type));
      break;
    }
    case 3: //RADIO_SUB_TEL
      console.log('Radio sub telegram received.'); 
      break;
    case 4: //EVENT
      console.log('Event message received.');
      break;
    case 5: //COMMON_COMMAND
      console.log('Common command received.');
      break;
    case 6: //SMART_ACK_COMMAND
      console.log('Smart Ack command received.');
      break;
    case 7: //REMOTE_MAN_COMMAND
      console.log('Remote management command received.');
      break;
    case 9: //RADIO_MESSAGE
      console.log('Radio message received.');
      break;
    case 10: //RADIO_ERP2
      console.log('ERP2 protocol radio telegram received.');
      break;
    case 16: //RADIO_802_15_4
      console.log('802_15_4_RAW Packet received.');
      break;
    case 17: //COMMAND_2_4
      console.log('2.4 GHz Command received.');
      break;
    default:
      console.log('Packet type ' + toHex(ESP3Packet.type) + ' has been received, but is not handled.');
      break;
  }
}

var serialport = require('serialport');
var portName = "/dev/ttyUSB0";

var myPort = new serialport(portName, {
    baudRate: 57600,
    parser: new serialport.parsers.Readline('\r\n')
});

myPort.on('open', onOpen);
myPort.on('data', onData);

function onOpen(){
    console.log('Open connections!');
}

function onData(data){
    console.log('on Data \r\n' + data + '\r\n geparst:' );
    parseMessage(data);

}
