class Nutzer {
  constructor(id,name){
    this.id=id
    this.name=name
    this.bereich_liste = []
  }
  async addBereich(bereich){
    var m = require('./dbManager');
    try {
      var obj = await m.createBereich(bereich.name,this.name)
      bereich.id = obj.insertId
    } catch(err){
      console.log(err)
    }
    this.bereich_liste.push(bereich)
  }
  async deleteBereich(index){
    var m = require('./dbManager');
    try {
      var obj = await m.remove_Bereich(this.bereich_liste[index].id)
    } catch(err){
      console.log(err)
    }
    this.bereich_liste.splice(index,1)
  }
}

class Bereich {
  constructor(id, name, nutzer){
    this.id = id
    this.name = name
    this.nutzer = nutzer
    this.listen_liste = []
    this.aufgaben_liste = []
    this.notizen_liste = []
  }
  async addListe(index,liste){
    var m = require('./dbManager');
    try {
      var obj = await m.createListe(liste.name,this.id,liste.datum)
      liste.id = obj.insertId
    } catch(err){
      console.log(err)
    }
    this.listen_liste.splice(index,0,liste)
  }
  async deleteListe(index){
    var m = require('./dbManager');
    try {
      var obj = await m.remove_Bereich(this.listen_liste[index].id)
    } catch(err){
      console.log(err)
    }
    return this.listen_liste.splice(index,1)
  }
  async addAufgabe(aufgabe) {
    var m = require('./dbManager');
    try {
      var obj = await m.createAufgabe(aufgabe.text, this.id, 0, aufgabe.datum, aufgabe.wichtung, aufgabe.done)
      aufgabe.id = obj.insertId
    } catch(err){
      console.log(err)
    }
    this.aufgaben_liste.splice(index,0,aufgabe)
  }
  async deleteAufgabe(index){
    var m = require('./dbManager');
    try {
      var obj = await m.remove_Bereich(this.aufgaben_liste[index].id)
    } catch(err){
      console.log(err)
    }
    return this.aufgaben_liste.splice(index,1)
  }
  async addNotiz(index,notiz){
    var m = require('./dbManager');
    try {
      var obj = await m.createNotiz(notiz.text,this.id,0,0)
      notiz.id = obj.insertId
    } catch(err){
      console.log(err)
    }
    this.notizen_liste.splice(index,0,notiz)
  }
  async deleteNotiz(index){
    var m = require('./dbManager');
    try {
      var obj = await m.remove_Bereich(this.notizen_liste[index].id)
    } catch(err){
      console.log(err)
    }
    return this.notizen_liste.splice(index,1)
  }
}

class Liste {
  constructor(id, bereich_id, name, datum){
    this.id = id
    this.bereich_id = bereich_id
    this.name = name
    this.datum = datum
    this.aufgaben_liste = []
    this.notizen_liste = []
  }
  async addAufgabe(index, aufgabe) {
    var m = require('./dbManager');
    try {
      var obj = await m.createAufgabe(aufgabe.text, this.bereich_id, this.id, aufgabe.datum, aufgabe.wichtung, aufgabe.done)
      aufgabe.id = obj.insertId
    } catch(err){
      console.log(err)
    }
    this.aufgaben_liste.splice(index,0,aufgabe)
  }
  async deleteAufgabe(index){
    var m = require('./dbManager');
    try {
      var obj = await m.remove_Bereich(this.aufgaben_liste[index].id)
    } catch(err){
      console.log(err)
    }
    return this.aufgaben_liste.splice(index,1)
  }
  async addNotiz(index, notiz){
    var m = require('./dbManager');
    try {
      var obj = await m.createNotiz(notiz.text,this.bereich_id,this.id,0)
      notiz.id = obj.insertId
    } catch(err){
      console.log(err)
    }
    this.notizen_liste.splice(index,0,notiz)
  }
  async deleteNotiz(index){
    var m = require('./dbManager');
    try {
      var obj = await m.remove_Bereich(this.notizen_liste[index].id)
    } catch(err){
      console.log(err)
    }
    return this.notizen_liste.splice(index,1)
  }
}

class Aufgabe {
  constructor(id, bereich_id, liste_id, text, datum, wichtung, done){
    this.id = id
    this.bereich_id = bereich_id
    this.liste_id = liste_id
    this.text = text
    this.datum = datum
    this.wichtung = wichtung
    this.done = done
    this.notizen_liste = []
  }
  async addNotiz(index, notiz){
    var m = require('./dbManager');
    try {
      var obj = await m.createNotiz(notiz.text,this.bereich_id,this.liste_id,this.id)
      notiz.id = obj.insertId
    } catch(err){
      console.log(err)
    }
    this.notizen_liste.splice(index,0,notiz)
  }
  async deleteNotiz(index){
    var m = require('./dbManager');
    try {
      var obj = await m.remove_Bereich(this.notizen_liste[index].id)
    } catch(err){
      console.log(err)
    }
    return this.notizen_liste.splice(index,1)
  }
}

class Notiz {
  constructor(id, bereich_id, liste_id, aufgabe_id, text){
    this.id = id
    this.bereich_id = bereich_id
    this.liste_id = liste_id
    this.aufgabe_id = aufgabe_id
    this.text = text
  }
}

async function startup(username) {
  var m = await require('./dbManager');
  var nutzerContent;
  nutzerContent = null
  try {
    nutzerContent = await m.getNutzer(username)
  }catch(err){
    console.log(err)
  }
  if(nutzerContent.length == 0){
    nutzerContent = await m.createNutzer(username)
    var user;
    user = new Nutzer(nutzerContent.insertId,username)
  }else {
    user = new Nutzer(nutzerContent[0].nutzer_id, nutzerContent[0].name)
  }
  try {
    b = await m.getBereiche(user.name)
  } catch (err){
    console.log(err)
  }
  bereich_liste = []
  for(i = 0; i < b.length;i++){
    bereich_liste.push(new Bereich(b[i].bereich_id,b[i].name,b[i].nutzer))
  }
  for(i = 0; i < bereich_liste.length; i++){
    try {
      content = await m.getFullContent_Bereich(bereich_liste[i].id)
      console.log(content.length)
      for(j=0;j<content.length;j++) {
        for (k = 0; k < content[j].length; k++) {
          if (j == 0) {
            bereich_liste[i].listen_liste.push(
              new Liste(content[j][k].liste_id, content[j][k].bereich, content[j][k].name, content[j][k].datum))
          } else if (j == 1) {
            bereich_liste[i].aufgaben_liste.push(
              new Aufgabe(content[j][k].aufgabe_id, content[j][k].bereich, content[j][k].liste, content[j][k].text, content[j][k].datum, content[j][k].wichtung, content[j][k].erledigt))
          } else if (j == 2) {
            bereich_liste[i].notizen_liste.push(
              new Notiz(content[j][k].notiz_id, content[j][k].bereich, content[j][k].liste, content[j][k].aufgabe, content[j][k].text))
          }
        }
      }
    }catch(err){
     console.log(err)
    }
    for(j=0;j<bereich_liste[i].listen_liste.length;j++)
      for (k = 0; k < bereich_liste[i].notizen_liste.length; k++)
        if(bereich_liste[i].listen_liste[j].id == bereich_liste[i].notizen_liste[k].liste_id)
          bereich_liste[i].listen_liste[j].notizen_liste.push(bereich_liste[i].notizen_liste[k])

    for(j=0;j<bereich_liste[i].aufgaben_liste.length;j++)
      for (k = 0; k < bereich_liste[i].notizen_liste.length; k++)
        if(bereich_liste[i].aufgaben_liste[j].id == bereich_liste[i].notizen_liste[k].aufgabe_id)
          bereich_liste[i].aufgaben_liste[j].notizen_liste.push(bereich_liste[i].notizen_liste[k])

    for(j=0;j<bereich_liste[i].listen_liste.length;j++)
      for (k = 0; k < bereich_liste[i].aufgaben_liste.length; k++)
        if(bereich_liste[i].listen_liste[j].id == bereich_liste[i].aufgaben_liste[k].liste_id)
          bereich_liste[i].listen_liste[j].aufgaben_liste.push(bereich_liste[i].aufgaben_liste[k])
  }
  console.log(bereich_liste)
  user.bereich_liste = bereich_liste
  return user
}
async function main() {
  // let b = new Bereich(1,"Test","Wormi")
  // await b.addAufgabe(new Aufgabe(null,b.id,0,"TestAufgabe1",null,null))
  // await b.addAufgabe(new Aufgabe(null,b.id,0,"TestAufgabe2",null,null))
  // await b.addAufgabe(new Aufgabe(null,b.id,0,"TestAufgabe3",null,null))
  // await b.addListe(new Liste(null,1,"Test",null))
  // console.log(b.nutzer)
  // console.log(b.aufgaben_liste)
  // for(var val of b.aufgaben_liste){
  //   console.log(val.text)
  // }
  username = "Wormi"
  try {
    user = await startup(username)
  }catch(err){
    console.log(err)
    user = new Nutzer(null,username)
  }
  console.log(user)
  var fs = require('fs')
  fs.writeFile("./object.json", JSON.stringify(user, null, 4), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    ;
    console.log("File has been created");
  });

}

main()
