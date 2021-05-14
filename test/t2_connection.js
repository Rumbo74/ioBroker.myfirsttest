
// testing the connection to the Eltako FGW14
// ##########################################

// load requires
const connectionFGW = require('../lib/tools/connectionFGW');
var assert = require('assert');
var fs = require('fs');
var testConnection = false;     // preset not too test the connection live

// information of file
describe('in file t2_connection.js #########################################################', function() {
	it('for information', function(done) {
		done();
	});
});

// testing - running on my TestPi?
describe('running on my TestPi?', function() {
    if (fs.existsSync('/var/local/testPi')) {
	    it('running on my TestPi', function(done) {
            testConnection = true;
	        done();
	    });
    } else {
	    it('###______NOT______### running on my TestPi - cancel testing of the connection', function(done) {
	        done();
	    });
    }
});

// no Singleton any more
//
//// testing - Singleton
//    describe('test Singleton of connection', function() {
//        describe('first instance', function() {
//            const singleton1 = connectionFGW;
//            console.log(singleton1)
//            it('should return "test"', function() {
//              assert.equal(singleton1.testing, "test" );
//              singleton1.testing = "hallo"
//            });
//        });
//        describe('second instance', function() {
//            const singleton123 = connectionFGW;
//            console.log(singleton123)
//            it('should return "hallo"', function() {
//              assert.equal(singleton123.testing, "hallo" );
//            });
//        });
//    });


// testing - Instance of connectionFGW
describe('test instance of connectionFGW', function() {
    describe('make instance', function() {
        const con = new connectionFGW();
        //console.log(con)
        it('should return "test"', function() {
          assert.equal(con.testing, "test" );
          con.testing = "hallo"
        });
        it('should return "hallo"', function() {
          assert.equal(con.testing, "hallo" );
        });
    });
    describe('make instance with new attributes', function() {
        const con = new connectionFGW( "/dev/ttyS007", 123 );
        //console.log(con)
        it('should return "/dev/ttyS007"', function() {
          assert.equal(con.path, "/dev/ttyS007" );
        });
        it('should return 123', function() {
          assert.equal(con.baudRate, 123 );
        });
    });
    // check portName
    // ----------------
    describe('make instance with standard port info', function() {
        const con = new connectionFGW();
        //console.log(con)
        it('should return "/dev/ttyS0"', function() {
          assert.equal(con.path, "/dev/ttyS0" );
        });
    });
    describe('make instance with port info "/dev/ttyS000"', function() {
        const con1 = new connectionFGW();
        //console.log(con1)
        con1.path = "/dev/ttyS000"
        //console.log(con1)
        it('should return "/dev/ttyS000"', function() {
          assert.equal(con1.path, "/dev/ttyS000" );
        });
    });
    // check baudRate
    // ----------------
    describe('make instance with standard baudRate', function() {
        const con2 = new connectionFGW();
        //console.log(con2)
        it('should return 57600', function() {
          assert.equal(con2.baudRate, 57600 );
        });
    });
    describe('make instance with baudRate 9600', function() {
        const con3 = new connectionFGW();
        //console.log(con3)
        con3.baudRate = 9600
        //console.log(con3)
        it('should return 9600', function() {
          assert.equal(con3.baudRate, 9600 );
        });
    });
});


// testing - Use connectionFGW to open connection
describe('Use connectionFGW to open connection', function() {
    //if (testConnection) {
    if (true) {	
        it('try open', function(done) {
            describe('open connection', function() {
                const con = new connectionFGW();
                con.path = "/dev/ttyUSB0"
                //console.log(con)
                con.openConnection()
            });
		    done();
	    });
    }
});





