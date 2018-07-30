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
  selector: 'page-task',
  templateUrl: 'task.html',
})
export class TaskPage {
  aufgabe_name
  datum = null
  wichtung = null
  add_to_options
  path
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    console.log(navParams.get('addToOptions'))
    this.aufgabe_name = navParams.get('aufgabe_name')
    this.datum = navParams.get('datum')
    this.wichtung = navParams.get('wichtung')
    this.path = navParams.get('path')
    this.add_to_options = navParams.get('addToOptions')
  }

  public  submitModal(){
    let data = { 'aufgabe_name': this.aufgabe_name,
      'datum':this.datum,
      'wichtung':this.wichtung,
      'done':false,
      'notizen_liste': [],
      'addTo': this.path};
    console.log(data)
    this.viewCtrl.dismiss(data);
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }
}
