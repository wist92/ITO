import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-area',
  templateUrl: 'area.html',
})
export class AreaPage {
  bereich_name
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  public  submitModal(){
    let data = { 'bereich_name': this.bereich_name,
      'listen_liste':[],
      'aufgaben_liste':[],
      'notizen_liste':[]};
    console.log(this.bereich_name)
    this.viewCtrl.dismiss(data);
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }
}
