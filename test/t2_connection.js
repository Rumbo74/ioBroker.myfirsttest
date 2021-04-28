
// testing the connection to the Eltako FGW14
// ##########################################

// load requires
const connectionFGW = require('../lib/tools/connectionFGW');
var assert = require('assert');
var fs = require('fs');
var testConnection = false;     // preset not too test the connection live


// testing - running on my TestPi?
describe('running on my TestPi?', function() {
    if (fs.existsSync('/etc/file')) {
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
            console.log(con)
            it('should return "test"', function() {
              assert.equal(con.testing, "test" );
              con.testing = "hallo"
            });
            it('should return "hallo"', function() {
              assert.equal(con.testing, "hallo" );
            });
        });
        describe('make instance with standard port info', function() {
            const con = new connectionFGW();
            console.log(con)
            it('should return "/dev/ttyStandard"', function() {
              assert.equal(con.path, "/dev/ttyStandard" );
            });
        });
        describe('make instance with port info "/dev/ttyS000"', function() {
            const con1 = new connectionFGW( "/dev/ttyS000");
            console.log(con1)
            it('should return "/dev/ttyS000"', function() {
              assert.equal(con1.path, "/dev/ttyS000" );
            });
        });
    });






//
//Laptop:
//[    7.458101] audit: type=1400 audit(1619544520.111:9): apparmor="STATUS" operation="profile_load" profile="unconfined" name="libreoffice-xpdfimport" pid=782 comm="apparmor_parser"
//michael@HP-Lappi:~/Schreibtisch/ioBroker Eltako FGW/ioBroker.myfirsttest$ dmesg|grep tty
//[    0.000000] printk: console [tty0] enabled
//[    2.590093] 00:04: ttyS0 at I/O 0x3f8 (irq = 4, base_baud = 115200) is a 16550A
//[    2.612915] 0000:00:16.3: ttyS4 at I/O 0x5050 (irq = 17, base_baud = 115200) is a 16550A
//




