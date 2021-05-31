

/**
 * Imports 
 */


/**
 * Class to present the connection to the FGW 
 */
class myLogger {


    // private fields
    #insightIOBroker = false;
    #loglevel = "error";        // preset loglevel to error
    #loglevelValue = 10;

	/**
     * Constructor of this class
     *
	 * @param {loglevel} string to define loglevel: "info", "warn", "error", "debug"
	 */
	constructor( loglevel ) {
        // check if we are insight of ioBroker - some tests are running outside as normal module
        if ( typeof( this.setStateAsync ) == 'function') {
            this.#insightIOBroker = true;
        }
        // check if the loglevel is OK and use it
        this.setLoglevel( loglevel );
    }   // end of function constructor

	/**
     * Function to set the log level
     *
	 * @param {loglevel} string to define loglevel: "info", "warn", "error", "debug"
	 */
	setLoglevel = function( loglevel ) {
        // check if the loglevel is OK and use it
        if ( typeof( loglevel ) != 'undefined') {
            if ( loglevel == "debug") {
                this.#loglevel = "debug";
                this.#loglevelValue = 40;
            } else if ( loglevel == "info") {
                this.#loglevel = "info";
                this.#loglevelValue = 30;
            } else if ( loglevel == "warn") {
                this.#loglevel = "warn";
                this.#loglevelValue = 20;
            } else if ( loglevel == "error") {
                this.#loglevel = "error";
                this.#loglevelValue = 10;
            }
        }
    }   // end of function constructor

	/**
     * Function to get the log level
	 */
	getLoglevel() {
        // check if the loglevel is OK and use it
        return this.#loglevel;

    }   // end of function constructor

	/**
	 * Function to log at level debug
     *
	 * @param {msg} message string to write
	 */
    debug = function ( msg ){

        // if loglevel is given
        if ( this.#loglevelValue >= 40 ){
            // write message to ioBroker or console
            if ( this.#insightIOBroker ){
                this.log.debug( msg )
            } else {
                console.log( msg );
            }

        }

    }   // end of function debug

	/**
	 * Function to log at level info
     *
	 * @param {msg} message string to write
	 */
    info = function ( msg ){

        // if loglevel is given
        if ( this.#loglevelValue >= 30 ){
            // write message to ioBroker or console
            if ( this.#insightIOBroker ){
                this.log.info( msg )
            } else {
                console.log( msg );
            }

        }

    }   // end of function info

	/**
	 * Function to log at level warn
     *
	 * @param {msg} message string to write
	 */
    warn = function ( msg ){

        // if loglevel is given
        if ( this.#loglevelValue >= 20 ){
            // write message to ioBroker or console
            if ( this.#insightIOBroker ){
                this.log.warn( msg )
            } else {
                console.log( msg );
            }

        }

    }   // end of function warn

	/**
	 * Function to log at level error
     *
	 * @param {msg} message string to write
	 */
    error = function ( msg ){

        // if loglevel is given
        if ( this.#loglevelValue >= 10 ){
            // write message to ioBroker or console
            if ( this.#insightIOBroker ){
                this.log.error( msg )
            } else {
                console.log( msg );
            }

        }

    }   // end of function error


}   // end of class myLogger



/*

(Alle Skript Logins ab Stufe Warnung ausgeben).

 

Folgendes Skript unter ****global**** einfügen und dann kann in jedem Skript die Funktion ****logs()**** (für Skript individuelle Log Ausgaben) genutzt werden:

 

>! ````

// globale Funktion:    logs(logtext,level,color)

// Version:             0.1.1

>! // Beschreibung:        Ermöglicht innerhalb eines Javascript-Scripts unterschiedliche Loglevel

//                      Benutzung, wie log() mit der zusätzlichen Option die Ausgabefarbe zu überschreiben

>! // Übergabeparameter:   logtext     der Text, der als Log ausgegeben werden soll

//                      level       [optional] der Loglevel der Meldung als String

//                                  der level (mögliche Werte definiert in JSON loglevels), in dem der Text ausgegeben werden soll

//                      color       [optional] die html-Farbe der Meldung als String, siehe z.B.: http://tomheller.de/theholycymbal/html-farben.html

//                                  "none"                  -> es wird die Standardfarbe von log() im Level Info ausgegebn.

//                                  nichts angegeben        -> es werden die Farben ais dem JSON loglevels je nach level ausgegeben

//                                  html-Farbe übergeben    -> es wird die übergebenen Farbe ausgegeben

>! // Rückgabe:            Gibt den aktuellen Loglevel für diesen Aufruf zurück.

//                      Gültiger level beim Aufruf          -> der im Script definierte Loglevel wird zurückgegeben

//                      kein Level angegeben                -> es wird der Level "info" verwendet und zurückgegeben

//                      ungültiger Level                    -> es wird der Level "info" verwendet und zurückgegeben

>! // Infos:               Benötigt im Javascript, welches die Funktion logs() verwendet

//                      die Variabele loglevel, z.B. var loglevel = "info";

//

// 0.1.1                Default Loglevel ergänzt

>! // -----------------------------------------------------------------------------

>! // globale Scripte werden vor dem eigentlichen Script als Text reinkopiert

// daher kann im globalen Script eine Variable einen Defaultwert enthalten

>! var loglevel = 'info'; // Default Loglevel, wenn der Loglevel im aufrufenden Script nicht definiert ist

>! // -----------------------------------------------------------------------------

// Script Log - logs() - ANFANG

// -----------------------------------------------------------------------------

var loglevels = {

    "debug2":   {"level":  -2,  "leveltext":"debug2: ",     "color": "blue"},

    "debug1":   {"level":  -1,  "leveltext":"debug1: ",     "color": "mediumblue"},

    "debug":    {"level":   0,  "leveltext":"debug0: ",     "color": "darkblue"},

    "debug0":   {"level":   0,  "leveltext":"debug0: ",     "color": "mediumblue"},

    "info":     {"level":  10,  "leveltext":"",             "color": "none"},

    "warn":     {"level":  20,  "leveltext":"warn: ",       "color": "darkorange"},

    "error":    {"level":  30,  "leveltext":"error:",       "color": "darkred"}

};

>! function logs(logtext,level,color) {

>!     // in der Funktion den gesetzten Level überprüfen

    if (typeof level == 'undefined') {level = 'info'}

    if (level in loglevels) {} else {

        log("ungültiger loglevel **" + level + "** in Funktion logs() im Script","warn");

        log("loglevel für das Script auf Stufe: " + loglevel + " gesetzt.","warn");

        level = 'info';

        loglevel = level;

    }

>!     // den im Script konfigurierten Loglevel prüfen

    // zum Scriptstart muss die Variable loglevel deklariert werden

    // z.B.:

    // var loglevel = "warn";

    if (typeof loglevel == 'undefined') {loglevel = 'info'}

    if (loglevel in loglevels) {} else {

        var loglevelError = loglevel;

        loglevel = 'info';      // Loglevel auf Info stellen, wenn kein gültiger Loglevel im Script deklariert ist

        log("ungültiger loglevel für logs() in der Konfiguration im Script","error");

        log("variable loglevel am Anfang des Scripts einem gültigen Wert zuweisen","error");

        log('im Script konfigurierter loglevel: '

            + loglevelError + ' -> geändert in: '

            + loglevel) + '',"warn";

    }

>!     // Farbe ernitteln

    if (typeof color == 'undefined') {color = loglevels[level].color}

>!     // Log je nach eingestelltem Loglevel ausgeben

    var levelConf = loglevels[loglevel].level;

    var levelLogs = loglevels[level].level;

    if (levelLogs >= levelConf) {

        if (color == "none") {

            log(loglevels[level].leveltext + logtext);

        } else {

            log('' + loglevels[level].leveltext + logtext + '');

        }

    }

>!     return loglevel;

}

// -----------------------------------------------------------------------------

// Script Log - logs() - ENDE

// -----------------------------------------------------------------------------

>! ````


*/




// export the instance of the connection to be sure to get only one instance
// Singleton Pattern - Node.JS like
// it is called cached singleton in Node.JS 
//
// the use of the class did not need the new() command
//  like:
//      const object = connectionFGW;
//  not like:
//      const object = new connectionFGW();

module.exports = new myLogger();


