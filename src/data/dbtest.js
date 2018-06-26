var m = require('./dbManager');

async function main(){
    try {
        obj = await m.setWeight_Aufgabe(2, 0.3)
        console.log(obj)
    } catch(err) {
        console.log(err)
    }
}


main();

/* Beispiel für die Anzahl der Kind-Elemente in einem Bereich
*  z.B. vor dem Löschen Ausführen um sicherzustellen, dass Bereich wirklich leer ist, bzw. der Nutzer gefragt werden kann,
*  ob wirklich alle x Kind-Elemente gelöscht werden sollen
*/
async function countChildrenof_Bereich(bereichs_id){
    try {
        obj = await m.getFullContent_Bereich(1)
         console.log(obj)
    } catch(err) {
        console.log(err)
    }
}

