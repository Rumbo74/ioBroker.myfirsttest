
// testing the connection to the Eltako FGW14
// ##########################################


const logger = require('../lib/tools/myLogging');
var counter = 0;

try{

    // Tests

    //process.on('beforeExit', code => {
    //  // Can make asynchronous calls
    //  setTimeout(() => {
    //    logger.info(`Process will exit with code: ${code}`)
    //    process.exit(code)
    //  }, 100)
    //})
    //
    //process.on('uncaughtException', err => {
    //  logger.info(`Uncaught Exception: ${err.message}`)
    //  process.exit(1)
    //})
    //
    //process.on('unhandledRejection', (reason, promise) => {
    //  logger.info('Unhandled rejection at ', promise, `reason: ${err.message}`)
    //  process.exit(1)
    //})



    // catch everything ( https://blog.heroku.com/best-practices-nodejs-errors )
    // #################
    function terminate (options = { coredump: false, timeout: 500 }) {
      // Exit function
      const exit = code => {
        options.coredump ? process.abort() : process.exit(code)
      }

      return (code, reason, counter) => (err, promise) => {
        counter = counter + 1;
        logger.info( 'ErrorReason:' + counter + ',' + reason)
        if (err && err instanceof Error) {
        // Log error information, use a proper logging library here :)
        logger.info( err.message + err.stack)
        }

        // Attempt a graceful shutdown
        setTimeout(exit, options.timeout).unref()
      };
    };

    const exitHandler = terminate({
      coredump: false,
      timeout: 500
    });

    process.on('uncaughtException', exitHandler(1, 'Unexpected Error', counter));
    process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise', counter));
    process.on('SIGTERM', exitHandler(0, 'SIGTERM', counter));
    process.on('SIGINT', exitHandler(0, 'SIGINT', counter));

    // #################




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
    //            logger.info(singleton1)
    //            it('should return "test"', function() {
    //              assert.equal(singleton1.testing, "test" );
    //              singleton1.testing = "hallo"
    //            });
    //        });
    //        describe('second instance', function() {
    //            const singleton123 = connectionFGW;
    //            logger.info(singleton123)
    //            it('should return "hallo"', function() {
    //              assert.equal(singleton123.testing, "hallo" );
    //            });
    //        });
    //    });


    // testing - Instance of connectionFGW
    describe('test instance of connectionFGW', function() {
        describe('make instance', function() {
            const con = new connectionFGW();
            //logger.info(con)
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
            //logger.info(con)
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
            //logger.info(con)
            it('should return "/dev/ttyS0"', function() {
              assert.equal(con.path, "/dev/ttyS0" );
            });
        });
        describe('make instance with port info "/dev/ttyS000"', function() {
            const con1 = new connectionFGW();
            //logger.info(con1)
            con1.path = "/dev/ttyS000"
            //logger.info(con1)
            it('should return "/dev/ttyS000"', function() {
              assert.equal(con1.path, "/dev/ttyS000" );
            });
        });
        // check baudRate
        // ----------------
        describe('make instance with standard baudRate', function() {
            const con2 = new connectionFGW();
            //logger.info(con2)
            it('should return 57600', function() {
              assert.equal(con2.baudRate, 57600 );
            });
        });
        describe('make instance with baudRate 9600', function() {
            const con3 = new connectionFGW();
            //logger.info(con3)
            con3.baudRate = 9600
            //logger.info(con3)
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
                    try{
                        const con = new connectionFGW();
                        con.path = "/dev/ttyUSB0"
                        //logger.info(con)
                        con.openConnection()
                    } catch (err){
                        logger.error(err);
                    }

                });
		        done();
	        });
        }
    });



} catch (err){
    logger.error(err);
}




