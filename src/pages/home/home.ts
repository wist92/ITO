import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'
import {DetailPage} from "../detail/detail";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  information: any[];
  checked: boolean = true;  // löschen nach Anpassung an Daten

//  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl : ModalController) {
//    let localData = http.get('assets/information.json').map(res => res.json().items);
//    localData.subscribe(data => {
//      this.information = data;
//    })
//  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl : ModalController) {
    let localData = http.get('assets/object.json').map(res => res.json().bereich_liste);
    localData.subscribe(data => {
      this.information = data;
      console.log(this.information[0].aufgaben_liste)
    })
  }

  toggleSection(i) {
    this.information[i].open = !this.information[i].open;
  }

  toggleItem(i, j) {
    this.information[i].listen_liste[j].open = !this.information[i].listen_liste[j].open;
  }

  newArea(){
    var areaPage = this.modalCtrl.create('AreaPage');
    areaPage.onDidDismiss(data => {
      if(data != null) {
        // Do things with data coming from modal, for instance :
        this.information.push(data)
        console.log(data)

      };
    });
    areaPage.present();
    console.log(this.information)
  }

  newList() {
    var addToOptions = []
    for(var i = 0;i < this.information.length; i++)
      addToOptions.push(this.information[i].bereich_name)

    var listPage = this.modalCtrl.create('ListPage', {'addToOptions': addToOptions})
    listPage.onDidDismiss(data => {
      if(data != null) {
        // Do things with data coming from modal, for instance :
        var path = data.addTo
        delete data['addTo']
        for(let i = 0; i < this.information.length; i++) {
          if(this.information[i].bereich_name == path) {
            this.information[i].listen_liste.push(data)
          }
        }
      }
      console.log(path)
      console.log(this.information);
    });
    listPage.present()
  }

  newTask(){
    var addToOptions = []
    for(var i = 0;i < this.information.length; i++) {
      addToOptions.push(this.information[i].bereich_name)
      for(var j = 0; j < this.information[i].listen_liste.length;j++) {
        addToOptions.push(this.information[i].bereich_name + '/' + this.information[i].listen_liste[j].liste_name)
      }
    }
    var taskPage = this.modalCtrl.create('TaskPage', {'addToOptions': addToOptions})
    taskPage.onDidDismiss(data => {
      if(data != null) {
        // Do things with data coming from modal, for instance :
        var path = data.addTo.split("/")
        delete data['addTo']
        for(let i = 0; i < this.information.length; i++) {
          if(this.information[i].bereich_name == path[0]) {
            if(path.length == 2) {
              for (let j = 0; j < this.information[i].listen_liste.length; j++) {
                  if(this.information[i].listen_liste[j].liste_name == path[1]) {
                    this.information[i].listen_liste[j].aufgaben_liste.push(data)
                  }
              }
            } else {
              this.information[i].aufgaben_liste.push(data)
            }
          }
        }
        console.log(path)
        console.log(this.information);
      }
    });
    taskPage.present();
  }

  editTaskSecond(i, j){
    var addToOptions = []
    for(var inf = 0;inf < this.information.length; inf++) {
      addToOptions.push(this.information[inf].bereich_name)
      for(var lis = 0; lis < this.information[inf].listen_liste.length;lis++) {
        addToOptions.push(this.information[inf].bereich_name + '/' + this.information[inf].listen_liste[lis].liste_name)
      }
    }
    var taskPage = this.modalCtrl.create('TaskPage',
      {'addToOptions': addToOptions,'aufgabe_name':this.information[i].aufgaben_liste[j].aufgabe_name,
      'datum':this.information[i].aufgaben_liste[j].datum,'wichtung':this.information[i].aufgaben_liste[j].wichtung,
      'path':this.information[i].bereich_name})

    taskPage.onDidDismiss(data => {
      if(data != null) {
        // Do things with data coming from modal, for instance :
        var path = data.addTo.split("/")
        delete data['addTo']
        this.information[i].aufgaben_liste.splice(j,1)
        for(let i = 0; i < this.information.length; i++) {
          if(this.information[i].bereich_name == path[0]) {
            if (path.length == 2) {
              for (let j = 0; j < this.information[i].listen_liste.length; j++) {
                if (this.information[i].listen_liste[j].liste_name == path[1]) {
                  this.information[i].listen_liste[j].aufgaben_liste.push(data)
                }
              }
            } else {
              this.information[i].aufgaben_liste.push(data)
            }
          }
        }
      }
      console.log(path)
      console.log(this.information);
    });
    taskPage.present();
  }

  editTaskThird(i, j, k) {
    var addToOptions = []
    for(var inf = 0;inf < this.information.length; inf++) {
      addToOptions.push(this.information[inf].bereich_name)
      for(var lis = 0; lis < this.information[inf].listen_liste.length;lis++) {
        addToOptions.push(this.information[inf].bereich_name + '/' + this.information[inf].listen_liste[lis].liste_name)
      }
    }
    var taskPage = this.modalCtrl.create('TaskPage',
      {'addToOptions': addToOptions,
        'aufgabe_name':this.information[i].listen_liste[j].aufgaben_liste[k].aufgabe_name,
        'datum':this.information[i].listen_liste[j].aufgaben_liste[k].datum,
        'wichtung':this.information[i].listen_liste[j].aufgaben_liste[k].wichtung,
        'path':this.information[i].bereich_name + "/" + this.information[i].listen_liste[j].liste_name})

    taskPage.onDidDismiss(data => {
      if(data != null) {
        // Do things with data coming from modal, for instance :
        var path = data.addTo.split("/")
        delete data['addTo']
        this.information[i].listen_liste[j].aufgaben_liste.splice(k,1)
        for(let i = 0; i < this.information.length; i++) {
          if(this.information[i].bereich_name == path[0]) {
            if (path.length == 2) {
              for (let j = 0; j < this.information[i].listen_liste.length; j++) {
                if (this.information[i].listen_liste[j].liste_name == path[1]) {
                  this.information[i].listen_liste[j].aufgaben_liste.push(data)
                }
              }
            } else {
              this.information[i].aufgaben_liste.push(data)
            }
          }
        }
      }
      console.log(path)
      console.log(this.information);
    });
    taskPage.present();
  }

  deleteTaskSecond(i, j) {
    this.information[i].aufgaben_liste.splice(j,1)
  }

  deleteTaskThird(i, j, k) {
    this.information[i].listen_liste[j].aufgaben_liste.splice(k,1)
  }

  checkItemSecond(i,j): void {
    this.information[i].aufgaben_liste[j].done = !this.information[i].aufgaben_liste[j].done
  }
  checkItemThird(i, j, k) {
    this.information[i].listen_liste[j].aufgaben_liste[k].done = !this.information[i].listen_liste[j].aufgaben_liste[k].done
  }
  goToDetailPage(item) {
    this.navCtrl.push(DetailPage, {
      item: item
    });
  }

}
