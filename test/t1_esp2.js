
// testing the parser of the exp2 - protocol
// #########################################

// load requires
const parser = require('../lib/tools/ESP2Packet');
var assert = require('assert');

// information of file
describe('in file t1_esp2.js #########################################################', function() {
	it('for information', function(done) {
		done();
	});
});

// testing - mocha working?
describe('mocha working?', function() {
	it('should pass if mocha is working', function(done) {
		done();
	});
});


// testing - checksum
    describe('testTelegram with wrong checksum', function() {
        describe('checksum: not valid', function() {
            var testTelegram = Buffer.from('a55a0b0500000000000010012049', 'hex');
            var result = parser(testTelegram);
            //console.log(result)
            it('should return "false"', function() {
              assert.equal(result.valid, false );
            });
        });
        describe('checksum: valid', function() {
            var testTelegram = Buffer.from('a55a0b0500000000000010012041', 'hex');
            var result = parser(testTelegram);
            //console.log(result)
            it('should return "true"', function() {
              assert.equal(result.valid, true );
            });
        });
    });

// testing - telegram length
    describe('testTelegram with wrong length', function() {
        describe('lenght: to short start of telegram', function() {
            var testTelegram = Buffer.from('a55a0b050000000000001', 'hex');
            var result = parser(testTelegram);
            //console.log(result)
            it('should return "false"', function() {
              assert.equal(result.valid, false );
            });
        });
        describe('lenght: to short end of telegram', function() {
            var testTelegram = Buffer.from('0000010012041', 'hex');
            var result = parser(testTelegram);
            //console.log(result)
            it('should return "false"', function() {
              assert.equal(result.valid, false );
            });
        });
        describe('lenght: to long', function() {
            var testTelegram = Buffer.from('a55a0b0500000056316515631531530000001', 'hex');
            var result = parser(testTelegram);
            //console.log(result)
            it('should return "false"', function() {
              assert.equal(result.valid, false );
            });
        });
    });

// testing - Sync-bytes
    describe('testTelegram with wrong Sync-bytes', function() {
        describe('Sync-bytes: wrong', function() {
            var testTelegram = Buffer.from('5aa50b0500000000000010012041', 'hex');
            var result = parser(testTelegram);
            //console.log(result)
            it('should return "false"', function() {
              assert.equal(result.valid, false );
            });
        });
    });

// testing - testTelegram_1
    describe('testTelegram_1: a55a0b0500000000000010012041', function() {
        const testTelegram_1 = Buffer.from('a55a0b0500000000000010012041', 'hex');
        var result = parser(testTelegram_1);
        //console.log(result)
        describe('headerId: "RRT"', function() {
            it('should return "RRT"', function() {
              assert.equal(result.headerId, 'RRT');
            });
        });
        describe('valid: "true"', function() {
            it('should return "true"', function() {
              assert.equal(result.valid, true);
            });
        });
        describe('org: "RPS"', function() {
            it('should return "RPS"', function() {
              assert.equal(result.org, "RPS");
            });
        });
        describe('transmitterId: "00001001"', function() {
            it('should return "00001001"', function() {
              assert.equal(result.transmitterId, "00001001");
            });
        });
        describe('T21: "PTM 120"', function() {
            it('should return "PTM 120"', function() {
              assert.equal(result.T21, "PTM 120");
            });
        });
        describe('NU: "U-message"', function() {
            it('should return "U-message"', function() {
              assert.equal(result.NU, "U-message");
            });
        });
        describe('repeaterLevel: 0', function() {
            it('should return 0', function() {
              assert.equal(result.repeaterLevel, 0);
            });
        });
        describe('simultaneouslyPressed: "0 Buttons"', function() {
            it('should return "0 Buttons"', function() {
              assert.equal(result.simultaneouslyPressed, "0 Buttons");
            });
        });
        describe('PR: "released"', function() {
            it('should return "released"', function() {
              assert.equal(result.PR, "released");
            });
        });
    });

// testing - testTelegram_2
    describe('testTelegram_2: a55a0b0500000000000010022042', function() {
        const testTelegram_2 = Buffer.from('a55a0b0500000000000010022042', 'hex');
        var result = parser(testTelegram_2);
        //console.log(result)
        describe('headerId: "RRT"', function() {
            it('should return "RRT"', function() {
              assert.equal(result.headerId, 'RRT');
            });
        });
        describe('valid: "true"', function() {
            it('should return "true"', function() {
              assert.equal(result.valid, true);
            });
        });
        describe('org: "RPS"', function() {
            it('should return "RPS"', function() {
              assert.equal(result.org, "RPS");
            });
        });
        describe('transmitterId: "00001002"', function() {
            it('should return "00001002"', function() {
              assert.equal(result.transmitterId, "00001002");
            });
        });
        describe('T21: "PTM 120"', function() {
            it('should return "PTM 120"', function() {
              assert.equal(result.T21, "PTM 120");
            });
        });
        describe('NU: "U-message"', function() {
            it('should return "U-message"', function() {
              assert.equal(result.NU, "U-message");
            });
        });
        describe('repeaterLevel: 0', function() {
            it('should return 0', function() {
              assert.equal(result.repeaterLevel, 0);
            });
        });
        describe('simultaneouslyPressed: "0 Buttons"', function() {
            it('should return "0 Buttons"', function() {
              assert.equal(result.simultaneouslyPressed, "0 Buttons");
            });
        });
        describe('PR: "released"', function() {
            it('should return "released"', function() {
              assert.equal(result.PR, "released");
            });
        });
    });

// testing - testTelegram_3
    describe('testTelegram_3: a55a0b05500000000000100230a2', function() {
        const testTelegram_3 = Buffer.from('a55a0b05500000000000100230a2', 'hex');
        var result = parser(testTelegram_3);
        //console.log(result)
        describe('headerId: "RRT"', function() {
            it('should return "RRT"', function() {
              assert.equal(result.headerId, 'RRT');
            });
        });
        describe('valid: "true"', function() {
            it('should return "true"', function() {
              assert.equal(result.valid, true);
            });
        });
        describe('org: "RPS"', function() {
            it('should return "RPS"', function() {
              assert.equal(result.org, "RPS");
            });
        });
        describe('transmitterId: "00001002"', function() {
            it('should return "00001002"', function() {
              assert.equal(result.transmitterId, "00001002");
            });
        });
        describe('T21: "PTM 120"', function() {
            it('should return "PTM 120"', function() {
              assert.equal(result.T21, "PTM 120");
            });
        });
        describe('NU: "N-message"', function() {
            it('should return "N-message"', function() {
              assert.equal(result.NU, "N-message");
            });
        });
        describe('repeaterLevel: 0', function() {
            it('should return 0', function() {
              assert.equal(result.repeaterLevel, 0);
            });
        });
        describe('rockerId: 1', function() {
            it('should return 1', function() {
              assert.equal(result.rockerId, 1);
            });
        });
        describe('UD: "I-button"', function() {
            it('should return "I-button"', function() {
              assert.equal(result.UD, "I-button");
            });
        });
        describe('PR: "pressed"', function() {
            it('should return "pressed"', function() {
              assert.equal(result.PR, "pressed");
            });
        });
        describe('secondRockerId: 0', function() {
            it('should return 0', function() {
              assert.equal(result.secondRockerId, 0);
            });
        });
        describe('SUD: "I-button"', function() {
            it('should return "I-button"', function() {
              assert.equal(result.SUD, "I-button");
            });
        });
        describe('SA: "No second action"', function() {
            it('should return "No second action"', function() {
              assert.equal(result.SA, "No second action");
            });
        });
    });

// testing - testTelegram_4
    describe('testTelegram_4: a55a0b05700000000000100130c1', function() {
        const testTelegram_4 = Buffer.from('a55a0b05700000000000100130c1', 'hex');
        var result = parser(testTelegram_4);
        //console.log(result)
        describe('headerId: "RRT"', function() {
            it('should return "RRT"', function() {
              assert.equal(result.headerId, 'RRT');
            });
        });
        describe('valid: "true"', function() {
            it('should return "true"', function() {
              assert.equal(result.valid, true);
            });
        });
        describe('org: "RPS"', function() {
            it('should return "RPS"', function() {
              assert.equal(result.org, "RPS");
            });
        });
        describe('transmitterId: "00001001"', function() {
            it('should return "00001001"', function() {
              assert.equal(result.transmitterId, "00001001");
            });
        });
        describe('T21: "PTM 120"', function() {
            it('should return "PTM 120"', function() {
              assert.equal(result.T21, "PTM 120");
            });
        });
        describe('NU: "N-message"', function() {
            it('should return "N-message"', function() {
              assert.equal(result.NU, "N-message");
            });
        });
        describe('repeaterLevel: 0', function() {
            it('should return 0', function() {
              assert.equal(result.repeaterLevel, 0);
            });
        });
        describe('rockerId: 1', function() {
            it('should return 1', function() {
              assert.equal(result.rockerId, 1);
            });
        });
        describe('UD: "O-button"', function() {
            it('should return "O-button"', function() {
              assert.equal(result.UD, "O-button");
            });
        });
        describe('PR: "pressed"', function() {
            it('should return "pressed"', function() {
              assert.equal(result.PR, "pressed");
            });
        });
        describe('secondRockerId: 0', function() {
            it('should return 0', function() {
              assert.equal(result.secondRockerId, 0);
            });
        });
        describe('SUD: "I-button"', function() {
            it('should return "I-button"', function() {
              assert.equal(result.SUD, "I-button");
            });
        });
        describe('SA: "No second action"', function() {
            it('should return "No second action"', function() {
              assert.equal(result.SA, "No second action");
            });
        });
    });

// testing - testTelegram_5
    describe('testTelegram_5: a55a8b07020000080000000400a0', function() {
        const testTelegram_5 = Buffer.from('a55a8b07020000080000000400a0', 'hex');
        var result = parser(testTelegram_5);
        //console.log(result)
        describe('headerId: "RMT"', function() {
            it('should return "RMT"', function() {
              assert.equal(result.headerId, "RMT");
            });
        });
        describe('valid: "true"', function() {
            it('should return "true"', function() {
              assert.equal(result.valid, true);
            });
        });
        describe('org: "4BS"', function() {
            it('should return "4BS"', function() {
              assert.equal(result.org, "4BS");
            });
        });
        describe('transmitterId: "00000004"', function() {
            it('should return "00000004"', function() {
              assert.equal(result.transmitterId, "00000004");
            });
        });
        describe('repeaterLevel: 0', function() {
            it('should return 0', function() {
              assert.equal(result.repeaterLevel, 0);
            });
        });
        describe('analogInput1: 0', function() {
            it('should return 0', function() {
              assert.equal(result.analogInput1, 0);
            });
        });
        describe('analogInput2: 0', function() {
            it('should return 0', function() {
              assert.equal(result.analogInput2, 0);
            });
        });
        describe('analogInput3: 2', function() {
            it('should return 2', function() {
              assert.equal(result.analogInput3, 2);
            });
        });
        describe('digitalInput1: 0', function() {
            it('should return 0', function() {
              assert.equal(result.digitalInput1, 0);
            });
        });
        describe('digitalInput2: 0', function() {
            it('should return 0', function() {
              assert.equal(result.digitalInput2, 0);
            });
        });
        describe('digitalInput3: 0', function() {
            it('should return 0', function() {
              assert.equal(result.digitalInput3, 0);
            });
        });
        describe('digitalInput4: 1', function() {
            it('should return 1', function() {
              assert.equal(result.digitalInput4, 1);
            });
        });
    });

// testing - testTelegram_6
    describe('testTelegram_6: a55a8b07020b00090000000400ac', function() {
        const testTelegram_6 = Buffer.from('a55a8b07020b00090000000400ac', 'hex');
        var result = parser(testTelegram_6);
        //console.log(result)
        describe('headerId: "RMT"', function() {
            it('should return "RMT"', function() {
              assert.equal(result.headerId, "RMT");
            });
        });
        describe('valid: "true"', function() {
            it('should return "true"', function() {
              assert.equal(result.valid, true);
            });
        });
        describe('org: "4BS"', function() {
            it('should return "4BS"', function() {
              assert.equal(result.org, "4BS");
            });
        });
        describe('transmitterId: "00000004"', function() {
            it('should return "00000004"', function() {
              assert.equal(result.transmitterId, "00000004");
            });
        });
        describe('repeaterLevel: 0', function() {
            it('should return 0', function() {
              assert.equal(result.repeaterLevel, 0);
            });
        });
        describe('analogInput1: 0', function() {
            it('should return 0', function() {
              assert.equal(result.analogInput1, 0);
            });
        });
        describe('analogInput2: 11', function() {
            it('should return 11', function() {
              assert.equal(result.analogInput2, 11);
            });
        });
        describe('analogInput3: 2', function() {
            it('should return 2', function() {
              assert.equal(result.analogInput3, 2);
            });
        });
        describe('digitalInput1: 1', function() {
            it('should return 1', function() {
              assert.equal(result.digitalInput1, 1);
            });
        });
        describe('digitalInput2: 0', function() {
            it('should return 0', function() {
              assert.equal(result.digitalInput2, 0);
            });
        });
        describe('digitalInput3: 0', function() {
            it('should return 0', function() {
              assert.equal(result.digitalInput3, 0);
            });
        });
        describe('digitalInput4: 1', function() {
            it('should return 1', function() {
              assert.equal(result.digitalInput4, 1);
            });
        });
    });

// testing - testTelegram_7
    describe('testTelegram_7: a55a8b07020c00090000000400ad', function() {
        const testTelegram_7 = Buffer.from('a55a8b07020c00090000000400ad', 'hex');
        var result = parser(testTelegram_7);
        //console.log(result)
        describe('headerId: "RMT"', function() {
            it('should return "RMT"', function() {
              assert.equal(result.headerId, "RMT");
            });
        });
        describe('valid: "true"', function() {
            it('should return "true"', function() {
              assert.equal(result.valid, true);
            });
        });
        describe('org: "4BS"', function() {
            it('should return "4BS"', function() {
              assert.equal(result.org, "4BS");
            });
        });
        describe('transmitterId: "00000004"', function() {
            it('should return "00000004"', function() {
              assert.equal(result.transmitterId, "00000004");
            });
        });
        describe('repeaterLevel: 0', function() {
            it('should return 0', function() {
              assert.equal(result.repeaterLevel, 0);
            });
        });
        describe('analogInput1: 0', function() {
            it('should return 0', function() {
              assert.equal(result.analogInput1, 0);
            });
        });
        describe('analogInput2: 12', function() {
            it('should return 12', function() {
              assert.equal(result.analogInput2, 12);
            });
        });
        describe('analogInput3: 2', function() {
            it('should return 2', function() {
              assert.equal(result.analogInput3, 2);
            });
        });
        describe('digitalInput1: 1', function() {
            it('should return 1', function() {
              assert.equal(result.digitalInput1, 1);
            });
        });
        describe('digitalInput2: 0', function() {
            it('should return 0', function() {
              assert.equal(result.digitalInput2, 0);
            });
        });
        describe('digitalInput3: 0', function() {
            it('should return 0', function() {
              assert.equal(result.digitalInput3, 0);
            });
        });
        describe('digitalInput4: 1', function() {
            it('should return 1', function() {
              assert.equal(result.digitalInput4, 1);
            });
        });
    });







//
//
//
//
//const testTelegram_2 = Buffer.from('', 'hex');
//const testTelegram_3 = Buffer.from('', 'hex');
//const testTelegram_4 = Buffer.from('', 'hex');
//const testTelegram_5 = Buffer.from('', 'hex');
//const testTelegram_6 = Buffer.from('', 'hex');
//const testTelegram_7 = Buffer.from('', 'hex');
//
//const arrayOfTelegrams = new Array( Buffer.from('a55a0b0500000000000010012041', 'hex'),
//                                    Buffer.from('a55a0b0500000000000010022042', 'hex'),
//                                    Buffer.from('a55a0b05500000000000100230a2', 'hex'),
//                                    Buffer.from('a55a0b05700000000000100130c1', 'hex'),
//                                    Buffer.from('a55a8b07020000080000000400a0', 'hex'),
//                                    Buffer.from('a55a8b07020b00090000000400ac', 'hex'),
//                                    Buffer.from('a55a8b07020c00090000000400ad', 'hex')
//                                    )
//
//var result = parser(testTelegram_1);
//
//console.log(result)
//
//
//
//
//arrayOfTelegrams.forEach(myFunction)
//
//function myFunction(item, index, arr) {
//
//    console.log(arr[index])
//
//    var result = parser(arr[index]);
//
//    console.log(result)
//
//
//} 
//

// hier lesen
// https://autom8able.com/blog/mochajs-setup
// https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
// https://www.chaijs.com/api/assert/

//
//console.log('in esp2')
//
//describe('smoke test', function() {
//	it('should pass if mocha is working', function(done) {
//		done();
//	});
//});
//
//describe('smoke test', function() {
//	it('should pass if mocha is working', function(done) {
//		done();
//	});
//	it.skip('should fail a test on error', function(done) {
//		throw new Error('This test should fail!');
//		done();
//	});
//});
//
//
// call something to test
//require('./firstTests.js');
//
// call the tests for the esp2 protocol
//require('./esp2.js');
//
//
//
//console.log('in esp2')
//
//var assert = require('assert');
//describe('Array', function() {
//  describe('#indexOf()  esp2 ', function() {
//    it('should return -1 when the value is not present', function() {
//      assert.equal([1, 2, 3].indexOf(4), -1);
//    });
//  });
//});
//
//
//
//console.log('in firstTests')
//
//var assert = require('chai').assert;
//var numbers = [1, 2, 3, 4, 5];
//
//assert.isArray(numbers, 'is array of numbers');
//assert.include(numbers, 2, 'array contains 2');
//assert.lengthOf(numbers, 5, 'array contains 5 numbers');
//
//
// var assert = require('assert');
//describe('Array', function() {
//  describe('#indexOf()   firstTests', function() {
//    it('is array of numbers', function() {
//      assert.isArray(numbers, 'is array of numbers');
//    });
//  });
//});
//
//
//
//
//
//var expect = require('chai').expect;
//var numbers = [1, 2, 3, 4, 5];
//
//expect(numbers).to.be.an('array').that.includes(2);
//expect(numbers).to.have.lengthOf(5);
//
//
//
//
//
//var should = require('chai').should();
//var numbers = [1, 2, 3, 4, 5];
//
//numbers.should.be.an('array').that.includes(2);
//numbers.should.have.lengthOf(5);



// #########################################################################################
// Config auslesen um zu speichern??
//
//
//console.log( getObject( "enocean.0.123450" ));  // Objekt 123450 aus Adapter enocean.0 holen
//console.log( getObject( "enocean.0.info" ));  // Objekt info aus Adapter enocean.0 holen
//console.log( getObject( "enocean.0.info" ));  // Objekt info aus Adapter enocean.0 holen
//console.log( getObject( "system.adapter.enocean.0" )); // angeblich den gesamten Adapter auslesen
//                                                       // aber Achtung es sind nicht alle Objekte aufgelistet
//
//
//








