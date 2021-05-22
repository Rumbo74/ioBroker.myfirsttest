'use strict';

const Transform = require('stream').Transform;
//const parser = require('./parser');
const parser = require('./ESP2Packet');
const logger = require('./myLogging');

const syncBytes = Buffer.from([0xa5, 0x5a]);



class TelegramTransformer extends Transform {

        constructor() {
            super();
            this.intBuffer = Buffer.alloc(0);
        }

        _transform(chunk, encoding, callback) {

            try{

                const totalLength = this.intBuffer.length + chunk.length;
                this.intBuffer = Buffer.concat([this.intBuffer, chunk], totalLength);
                this.processChunk(callback);

            } catch (err){
                logger.error(err);
            }
        }

        _flush(callback) {
            this.processChunk(callback);
        }

        processChunk(callback) {

            try{


                console.log('processChunk Data \r\n' + this.intBuffer.toString("hex") );

                // find start sequence
                const syncIndex = this.intBuffer.indexOf(syncBytes);
                // Go on if syncBytes not found
                if ( syncIndex === -1 ) return callback();
                // Go on if internal buffer / telegram to short
                if ( this.intBuffer.length < 8 ) return callback();

//exception handling wie unter
//    https://signal.co/blog/exception-handling-in-node-js/



                // read header behind sync bytes and read telegram length
                const header = this.intBuffer.readUInt8(syncIndex + syncBytes.length);
                const telegramLength = header & 0x1f;

                // slice complete telegramm
                const lengthSyncAndHeader = syncBytes.length + 1;
                if (this.intBuffer.length >= syncIndex + lengthSyncAndHeader + telegramLength) {
                    const processingBuffer = this.intBuffer.slice(syncIndex, telegramLength + lengthSyncAndHeader);
                    this.pushTelegram(processingBuffer);
                    this.intBuffer = this.intBuffer.slice(syncIndex + telegramLength + lengthSyncAndHeader, this.intBuffer.length);
                    this.processChunk(callback);
                } else {
                    return callback();
                }

            } catch (err){
                logger.error(err);
            }
        }

        pushTelegram(buf) {

            try{

                const translate = parser(buf);
                this.push(JSON.stringify(translate) + '\n', 'utf8');

            } catch (err){
                logger.error(err);
            }
        }

}   // end of class TelegramTransformer



module.exports = TelegramTransformer;
