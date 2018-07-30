export class Bereich {
  constructor(name, nutzer){
    this.name = name
    this.nutzer = nutzer
    this.listen_liste = []
    this.aufgaben_liste = []
    this.notizen_liste = []
  }
  addListe(index,liste){
    this.listen_liste.splice(index,0,liste)
  }
  deleteListe(index){
    return this.listen_liste.splice(index,1)
  }
  addAufgabe(aufgabe) {
    this.aufgaben_liste.splice(index,0,aufgabe)
  }
  deleteAufgabe(index){
    return this.aufgaben_liste.splice(index,1)
  }
  addNotiz(index,notiz){
    this.notizen_liste.splice(index,0,notiz)
  }
  deleteNotiz(index){
    return this.notizen_liste.splice(index,1)
  }
}

class Liste {
  constructor(name, datum){
    this.name = name
    this.datum = datum
    this.aufgaben_liste = []
    this.notizen_liste = []
  }
  addAufgabe(index, aufgabe) {
    this.aufgaben_liste.splice(index,0,aufgabe)
  }
  deleteAufgabe(index){
    return this.aufgaben_liste.splice(index,1)
  }
  addNotiz(index, notiz){
    this.notizen_liste.splice(index,0,notiz)
  }
  deleteNotiz(index){
    return this.notizen_liste.splice(index,1)
  }
}

class Aufgabe {
  constructor(text, datum, wichtung, done){
    this.text = text
    this.datum = datum
    this.wichtung = wichtung
    this.done = done
    this.notizen_liste = []
  }
  addNotiz(index, notiz){
    this.notizen_liste.splice(index,0,notiz)
  }
  deleteNotiz(index){
    return this.notizen_liste.splice(index,1)
  }
}

class Notiz {
  constructor(text){
    this.text = text
  }
}

function startup(username) {

}

function writeJSON(bereich_liste) {
  var fs = require('fs')
  fs.writeFile("./information.json", JSON.stringify(bereich_liste, null, 4), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    console.log("File has been created");
  });
}

function load_local() {
  var fs = require('fs')
  var bereich_liste = []
  try {
    var data = fs.readFileSync('object.json', 'utf8');
    console.log(data);
    bereich_liste = JSON.parse(data)
    console.log(bereich_liste)
  } catch(e) {
    console.log('Error:', e.stack);
  }
  return bereich_liste
}

load_local()
