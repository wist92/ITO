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
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
  liste_name
  datum = null
  add_to_options
  path
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    console.log(navParams.get('addToOptions'))
    this.add_to_options = navParams.get('addToOptions')
  }

  public  submitModal(){
    let data = { 'liste_name': this.liste_name,
      'aufgaben_liste':[],
      'notizen_liste':[],
      'addTo': this.path};
    console.log(this.liste_name)
    this.viewCtrl.dismiss(data);
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }
}
