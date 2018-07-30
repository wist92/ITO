import { Component } from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {
  information: any[];
  selectedItem: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl : ModalController) {
    let localData = http.get('assets/object.json').map(res => res.json().bereich_liste);
    localData.subscribe(data => {
      this.information = data;
      console.log(this.information[0].aufgaben_liste)
    })
    this.selectedItem = navParams.get('item');
  }

  toggleItem() {
    this.selectedItem.open = !this.selectedItem.open;
  }

  newNotiz() {
    var notizPage = this.modalCtrl.create('NotizPage');
    notizPage.onDidDismiss(data => {
      if(data != null) {
        this.selectedItem.notizen_liste.push(data)
        console.log(data)

      };
    });
    notizPage.present();
    console.log(this.information)
  }

  editItem(i) {
    var notizPage = this.modalCtrl.create('NotizPage',
      {'notiz_name': this.selectedItem.notizen_liste[i].notiz_name});
    notizPage.onDidDismiss(data => {
      if(data != null) {
        this.selectedItem.notizen_liste.splice(i,1)
        this.selectedItem.notizen_liste.push(data)
        console.log(data)

      };
    });
    notizPage.present();
    console.log(this.information)
  }

  deleteItem(i) {
    this.selectedItem.notizen_liste.splice(i,1)
  }
}
