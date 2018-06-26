function connect(){
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "",
        user: "",
        password: "",
        database: "nidhogg",
        multipleStatements: true
    });

    con.connect(function(err){
        if(err) throw err;
        console.log("Connected to database!");
    });
    return con;
};

/**
 *
 * @param name Name des zu erstellenden Nutzers
 * @returns {Promise<any>} Result-Objekt, das unter anderem die verwendtete ID (insertId) beinhaltet
 */
function createNutzer(name) {
    return new Promise(function (resolve, reject){ // Promise, um auf die Rückgabe in einer async Funktion mit await warten zu können
        con = connect(); // DB-Verbindung öffnen
        var sql = "INSERT INTO Nutzer (name) VALUES (?)";

        con.query(sql, [name], function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param bereichsname Name des zu erstellenden Bereichs
 * @param nutzername Name des Nutzers, zu dem der Bereich zugeordnet wird
 * @returns {Promise<any>} Result-Objekt, das unter anderem die verwendtete ID (insertId) beinhaltet
 */
function createBereich(bereichsname, nutzername) {
    var data = [bereichsname, nutzername]; // Vereinfachung der Parameter für den Query
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "INSERT INTO Bereich (name, nutzer) VALUES (?)";

        con.query(sql, [data], function (err, result) {
            if (err) reject (err);
            resolve(result);
            con.end();
        });})
}


/**
 *
 * @param listenname Name der Liste z.B "Uni"
 * @param bereichsid ID des Bereichs, in dem die Liste liegt (darf nicht null sein)
 * @param datum Datum, bis zu dem, die Liste abgearbeitet sein muss ('YYYY-MM-DD', kann mit null angegeben werden
 * @returns {Promise<any>} Result-Objekt, das unter anderem die verwendtete ID (insertId) beinhaltet
 *
 * Die Funktion fügt eine Liste mit den übergebenen Parametern in die Datenbank ein.
 */
function createListe(listenname, bereichsid, datum) {
    var data = [listenname, bereichsid, datum];
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "INSERT INTO Liste (name, bereich, datum) VALUES (?)";

        con.query(sql, [data], function (err, result) {
            if (err) reject (err);
            resolve(result);
            con.end();
        });})
}

/**
 *
 * @param aufgabentext Inhalt der Aufgabe
 * @param bereichsid ID des Bereichs in dem die Aufgabe liegt (darf nicht null sein)
 * @param listenid ID der Liste in der die Aufgabe liegt (0, falls sich die Aufgabe in keiner Liste befindet)
 * @param datum Datum bis zu dem die Aufgabe abgearbeitet werden soll (kann null sein)
 * @param wichtung Wichtung mit der die Aufgabe in den Abschluss ihres übergeordneten Elements zählt (0.0 - 1.0) (kann null sein)
 * @param erledigt Boolean, der angibt, ob die Aufgabe erledigt ist oder nicht (kann null sein)
 * @returns {Promise<any>} Result-Objekt, das unter anderem die verwendtete ID (insertId) beinhaltet
 */
function createAufgabe(aufgabentext, bereichsid, listenid, datum, wichtung, erledigt) {
    var data = [aufgabentext, bereichsid, listenid, datum, wichtung, erledigt];
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "INSERT INTO Aufgabe (text, bereich, liste, datum, wichtung, erledigt) VALUES (?)";

        con.query(sql, [data], function (err, result) {
            if (err) reject (err);
            resolve(result);
            con.end();
        });})
}

/**
 *
 * @param notiztext Inhalt der zu erstellenden Notiz
 * @param bereichsid ID des Bereichs in dem sich die Notiz befindet (darf nicht null sein)
 * @param listenid ID der Liste in der die Notiz liegt (0, falls sich die Notiz in keiner Liste befindet)
 * @param aufgabenid ID der Aufgabe in der die Notiz liegt (0, falls sich die Notiz in keiner Aufgabe befindet)
 * @returns {Promise<any>} Result-Objekt, das unter anderem die verwendtete ID (insertId) beinhaltet
 */
function createNotiz(notiztext, bereichsid, listenid, aufgabenid) {
    var data = [notiztext, bereichsid, listenid, aufgabenid];
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "INSERT INTO Notiz (text, bereich, liste, aufgabe) VALUES (?)";

        con.query(sql, [data], function (err, result) {
            if (err) reject (err);
            resolve(result);
            con.end();
        });})
}

/**
 *
 * @param name Name des Nutzers, der zurückgegeben werden soll
 * @returns {Promise<any>} Result-Objekt, dass den Nutzer enthält
 */
function getNutzer(name) {
    return new Promise(function (resolve, reject){ // Promise, um auf die Rückgabe in einer async Funktion mit await warten zu können
        con = connect(); // DB-Verbindung öffnen
        var sql = "SELECT * FROM Nutzer WHERE name = ?";

        con.query(sql, [name], function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param nutzername Name des Nutzers dessen Bereiche ausgegeben werden sollen
 * @returns {Promise<any>} Result-Objekt, dass alle Bereiche des Nutzers beinhaltet.
 */
function getBereiche(nutzername) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "SELECT * FROM Bereich WHERE nutzer = ?";

        con.query(sql, [nutzername], function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param bereichsid ID des Bereichs dessen Inhalt zurückgegegben werden soll
 * @returns {Promise<any>} Result-Objekt mit dem kompletten Inhalt des Bereichs, mit der folgenden Struktur: [ [Listen] [Aufagben] [Notizen] ]
 *
 * Die Funktion liefert den gesamten Inhalt eines Bereichs zurück.
 * Das beinhaltet auch alle indirekten Elemente, die z.B. in einer Liste des Bereichs liegen, bis zur letzten Ebene.
 */
function getFullContent_Bereich(bereichsid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "SELECT * FROM Liste WHERE bereich = "   + bereichsid + "; " +
                  "SELECT * FROM Aufgabe WHERE bereich = " + bereichsid + "; "+
                  "SELECT * FROM Notiz WHERE bereich = " + bereichsid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param listenid ID der Liste deren Inhalt zurückgegegben werden soll
 * @returns {Promise<any>} Result-Objekt mit dem kompletten Inhalt der Liste, mit der folgenden Struktur: [ [Aufagben] [Notizen] ]
 *
 * Die Funktion liefert den gesamten Inhalt einer Liste zurück.
 * Das beinhaltet auch alle indirekten Elemente, die z.B. in einer Aufgabe der Liste liegen.
 */
function getFullContent_Liste(listenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "SELECT * FROM Aufgabe WHERE liste = " + listenid + "; "+
            "SELECT * FROM Notiz WHERE liste = " + listenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param aufgabenid ID der Aufgabe deren Inhalt zurückgegegben werden soll
 * @returns {Promise<any>} Result-Objekt mit dem kompletten Inhalt der Aufgabe, mit der folgenden Struktur: [Notizen]
 *
 * Die Funktion liefert den gesamten Inhalt einer Aufgabe zurück (d.h. alle Notizen, die ihr zugeordnet sind).
 */
function getFullContent_Aufgabe(aufgabenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "SELECT * FROM Notiz WHERE aufgabe = " + aufgabenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param bereichsid ID des Bereichs dessen erste Ebene an Inhalt ausgegeben werden soll
 * @returns {Promise<any>} Result-Objekt mit dem Inhalt des Bereichs, mit der folgenden Struktur: [ [Listen] [Aufagben] [Notizen] ]
 *
 * Die Funktion liefert die erste Ebene des Bereichs zurück, d.h. sie gibt alle Listen, Aufagben und Notizen, die sich innerhalb des Bereichs befinden zurück.
 * Alle indirekten Elemente des Bereichs (z.B. eine Aufgabe innerhalb einer Liste, die ein Teil des Result-Obj. ist) werden nicht zurückgegeben.
 */
function getFirstLayerContent_Bereich(bereichsid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "SELECT * FROM Liste WHERE bereich = "   + bereichsid + ";" +
            "SELECT * FROM Aufgabe WHERE bereich = " + bereichsid + " AND liste = 0; "+
            "SELECT * FROM Notiz WHERE bereich = " + bereichsid + " AND liste = 0 AND Aufgabe = 0; ";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param listenid ID der Liste deren erste Ebene an Inhalt ausgegeben werden soll
 * @returns {Promise<any>} Result-Objekt mit dem Inhalt der Liste, mit der folgenden Struktur: [ [Aufagben] [Notizen] ]
 *
 * Die Funktion liefert die erste Ebene der Liste zurück, d.h. sie gibt alle Aufagben und Notizen, die sich innerhalb der Liste befinden zurück.
 * Alle indirekten Elemente der Liste (z.B. eine Notiz innerhalb einer Aufgabe, die ein Teil des Result-Obj. ist) werden nicht zurückgegeben.
 */
function getFirstLayerContent_Liste(listenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "SELECT * FROM Aufgabe WHERE liste = " + listenid + "; "+
            "SELECT * FROM Notiz WHERE liste = " + listenid + " AND aufgabe = 0;";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param bereichsid ID des Bereichs, der samt Inhalt aus der Datenbank entfernt werden soll
 * @returns {Promise<any>} Result-Obj. Struktur: [ [Notiz] [Aufgabe] [Liste] [Bereich] ] jeweils u.a. mit Anzahl betroffener Reihen (affectedRows)
 *
 * Die Funktion löscht den übergebenen Bereich samt Inhalt aus der Datenbank.
 */
function remove_Bereich(bereichsid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "DELETE FROM Notiz WHERE bereich = "   + bereichsid + "; " +
            " DELETE FROM Aufgabe WHERE bereich = " + bereichsid + "; "+
            " DELETE FROM Liste WHERE bereich = " + bereichsid + "; " +
            " DELETE FROM Bereich WHERE bereich_id = " + bereichsid + ";";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param listenid ID der Liste, die samt Inhalt aus der Datenbank entfernt werden soll
 * @returns {Promise<any>} Result-Obj. Struktur: [ [Notiz] [Aufgabe] [Liste] ] jeweils u.a. mit Anzahl betroffener Reihen (affectedRows)
 *
 * Die Funktion löscht die übergebene Liste samt Inhalt aus der Datenbank.
 */
function remove_Liste(listenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "DELETE FROM Notiz WHERE liste = "   + listenid + "; " +
            " DELETE FROM Aufgabe WHERE liste = " + listenid + "; "+
            " DELETE FROM Liste WHERE liste_id = " + listenid + "; ";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param aufgabenid ID der Aufgabe, die samt Inhalt aus der Datenbank entfernt werden soll
 * @returns {Promise<any>} Result-Obj. Struktur: [ [Notiz] [Aufgabe] ] jeweils u.a. mit Anzahl betroffener Reihen (affectedRows)
 *
 * Die Funktion löscht die übergebene Aufgabe samt Inhalt aus der Datenbank.
 */
function remove_Aufgabe(aufgabenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "DELETE FROM Notiz WHERE aufgabe = "   + aufgabenid + "; " +
            " DELETE FROM Aufgabe WHERE aufgabe_id = " + aufgabenid + "; ";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param notizid ID der Notiz, dieaus der Datenbank entfernt werden soll
 * @returns {Promise<any>} Result-Obj. Struktur: [Notiz] u.a. mit Anzahl betroffener Reihen (affectedRows)
 *
 * Die Funktion löscht die übergebene Notiz aus der Datenbank.
 */
function remove_Notiz(notizid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "DELETE FROM Notiz WHERE notiz_id = "   + notizid + "; ";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param bereichsid ID des Bereichs, der komplett von Kind-Elementen geleert werden soll
 * @returns {Promise<any>} Result-Obj. Struktur: [ [Notiz] [Aufgabe] [Liste] ] jeweils u.a. mit Anzahl betroffener Reihen (affectedRows)
 *
 * Die Funktion entfernt alle Kind-Elemente des übergebenen Bereichs aus der Datenbank.
 */
function empty_Bereich(bereichsid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "DELETE FROM Notiz WHERE bereich = "   + bereichsid + "; " +
            " DELETE FROM Aufgabe WHERE bereich = " + bereichsid + "; "+
            " DELETE FROM Liste WHERE bereich = " + bereichsid + "; ";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param listenid ID der Liste, die komplett von Kind-Elementen geleert werden soll
 * @returns {Promise<any>} Result-Obj. Struktur: [ [Notiz] [Aufgabe] ] jeweils u.a. mit Anzahl betroffener Reihen (affectedRows)
 *
 * Die Funktion entfernt alle Kind-Elemente der übergebenen Liste aus der Datenbank.
 */
function empty_Liste(listenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "DELETE FROM Notiz WHERE liste = "   + listenid + "; " +
            " DELETE FROM Aufgabe WHERE liste = " + listenid + "; ";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param aufgabenid ID der Aufgabe, die komplett von Kind-Elementen geleert werden soll
 * @returns {Promise<any>} Result-Obj. Struktur: [Notiz] u.a. mit Anzahl betroffener Reihen (affectedRows)
 *
 * Die Funktion entfernt alle Kind-Elemente der übergebenen Aufgabe aus der Datenbank.
 */
function empty_Aufgabe(aufgabenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "DELETE FROM Notiz WHERE aufgabe = "   + aufgabenid + "; ";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param bereichsid ID des Bereichs, dessen Name angepasst werden soll
 * @param newName Neuer Name des Bereichs
 * @returns {Promise<any>} Result-Obj.
 *
 * Die Funktion ändert den Namen des Bereichs.
 */
function setName_Bereich(bereichsid, newName) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Bereich SET name = '" + newName + "' WHERE bereich_id = " + bereichsid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param listenid ID der Liste, deren Name angepasst werden soll
 * @param newName Neuer Name der Liste
 * @returns {Promise<any>} Result-Obj.
 *
 * Die Funktion ändert den Namen der Liste.
 */
function setName_Liste(listenid, newName) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Liste SET name = '" + newName + "' WHERE liste_id = " + listenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param aufgabenid ID der Aufgabe, deren Text angepasst werden soll
 * @param newText Neuer Text der Aufgabe
 * @returns {Promise<any>} Result-Obj.
 *
 * Die Funktion ändert den Text der Aufgabe.
 */
function setText_Aufgabe(aufgabenid, newText) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Aufgabe SET text = '" + newText + "' WHERE aufgabe_id = " + aufgabenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param notizid ID der Notiz, deren Text angepasst werden soll
 * @param newText Neuer Text der Notiz
 * @returns {Promise<any>} Result-Obj.
 *
 * Die Funktion ändert den Text der Notiz.
 */
function setText_Notiz(notizid, newText) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Notiz SET text = '" + newText + "' WHERE notiz_id = " + notizid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param listenid ID der Liste deren Bereich geändert werden soll
 * @param newBereichsid ID des Bereichs, dem die Liste neu zugeordnet werden soll
 * @returns {Promise<any>} Result-Obj.
 *
 * Verschiebt die Liste samt Inhalt in einen anderen Bereich.
 */
function setLocation_Liste(listenid, newBereichsid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Liste SET bereich =" + newBereichsid + " WHERE liste_id = " + listenid + ";" +
            "UPDATE Aufgabe SET bereich =" + newBereichsid + " WHERE liste = " + listenid + ";" +
            "UPDATE Notiz SET bereich =" + newBereichsid + " WHERE liste = " + listenid + ";";

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param aufgabenid ID der Aufgabe die verschoben werden soll
 * @param newBereichsid ID des neues Bereichs der Aufgabe
 * @param newListenid ID der neuen Liste der Aufgabe
 * @returns {Promise<any>} Result-Obj.
 *
 *  Verschiebt die Aufgabe samt Inhalt in einen anderen Bereich und/oder einer andere Liste
 */
function setLocation_Aufgabe(aufgabenid, newBereichsid, newListenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Aufgabe SET bereich = " + newBereichsid + ", liste = "+ newListenid +" WHERE aufgabe_id = " + aufgabenid + "; "+
            "UPDATE Notiz SET bereich = " + newBereichsid + ", liste = " + newListenid + " WHERE aufgabe = " + aufgabenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param notizid ID der Notiz die verschoben werden soll
 * @param newBereichsid ID des neues Bereichs der Notiz
 * @param newListenid ID der neuen Liste der Notiz
 * @param newAufgabenid ID der neuen Aufgabe der Notiz
 * @returns {Promise<any>} Result-Obj.
 *
 *  Verschiebt die Notiz in einen anderen Bereich und/oder eine andere Liste und/oder eine andere Aufgabe
 */
function setLocation_Notiz(notizid, newBereichsid, newListenid, newAufgabenid) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Notiz SET bereich = " + newBereichsid + ", liste = " + newListenid + ", aufgabe = " + newAufgabenid + " WHERE notiz_id = " + notizid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param listenid ID der Liste, die bearbeitet werden soll
 * @param datum Neues Datum der Liste (kann auch null  bzw '0000-00-00' sein, um das Datum zu entfernen)
 * @returns {Promise<any>} Result-Obj.
 *
 * Die Funktion ändert das Datum einer Liste.
 */
function setDate_Liste(listenid, datum) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Liste SET datum = '" + datum + "' WHERE liste_id = " + listenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param aufgabenid ID der Aufgabe, die bearbeitet werden soll
 * @param datum Neues Datum der Aufgabe (kann auch null bzw '0000-00-00' sein, um das Datum zu entfernen)
 * @returns {Promise<any>} Result-Obj.
 *
 * Die Funktion ändert das Datum einer Aufgabe.
 */
function setDate_Aufgabe(aufgabenid, datum) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Aufgabe SET datum = '" + datum + "' WHERE aufgabe_id = " + aufgabenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param aufgabenid ID der Aufgabe, die bearbeitet werden soll
 * @param erledigt BOOLEAN, der angibt ob die Aufgabe erledigt wurde oder nicht
 * @returns {Promise<any>} Result-Obj.
 *
 * Ändert den Status einer Aufgabe (true -> erledigt, false -> nicht erledigt)
 */
function setDone_Aufgabe(aufgabenid, erledigt) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Aufgabe SET erledigt = " + erledigt + " WHERE aufgabe_id = " + aufgabenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}

/**
 *
 * @param aufgabenid ID der Aufgabe, die bearbeitet werden soll
 * @param weight DOUBLE, der die neue Wichtung angibt (0.0 - 1.0) (kann null sein, um die Wichtung zu entfernen)
 * @returns {Promise<any>} Result-Obj.
 *
 *  Ändert die Wichtung einer Aufgabe
 */
function setWeight_Aufgabe(aufgabenid, weight) {
    return new Promise(function (resolve, reject){
        con = connect();
        var sql = "UPDATE Aufgabe SET wichtung = " + weight + " WHERE aufgabe_id = " + aufgabenid;

        con.query(sql, function (err, result) {
            if (err) reject (err);
            resolve(result); // Bereitstellen der Rückgabe
            con.end(); // DB-Verbindung schließen
        });})
}


exports.createNutzer = createNutzer;
exports.createBereich = createBereich;
exports.createListe = createListe;
exports.createAufgabe = createAufgabe;
exports.createNotiz = createNotiz;
exports.getNutzer = getNutzer;
exports.getBereiche = getBereiche;
exports.getFullContent_Bereich = getFullContent_Bereich;
exports.getFullContent_Liste = getFullContent_Liste;
exports.getFullContent_Aufgabe = getFullContent_Aufgabe;
exports.getFirstLayerContent_Bereich = getFirstLayerContent_Bereich;
exports.getFirstLayerContent_Liste = getFirstLayerContent_Liste;
exports.remove_Bereich = remove_Bereich;
exports.remove_Liste = remove_Liste;
exports.remove_Aufgabe = remove_Aufgabe;
exports.remove_Notiz = remove_Notiz;
exports.empty_Bereich = empty_Bereich;
exports.empty_Liste = empty_Liste;
exports.empty_Aufgabe = empty_Aufgabe;
exports.setName_Bereich = setName_Bereich;
exports.setName_Liste = setName_Liste;
exports.setText_Aufgabe = setText_Aufgabe;
exports.setText_Notiz = setText_Notiz;
exports.setLocation_Liste = setLocation_Liste;
exports.setLocation_Aufgabe = setLocation_Aufgabe;
exports.setLocation_Notiz = setLocation_Notiz;
exports.setDate_Liste = setDate_Liste;
exports.setDate_Aufgabe = setDate_Aufgabe;
exports.setDone_Aufgabe = setDone_Aufgabe;
exports.setWeight_Aufgabe = setWeight_Aufgabe;