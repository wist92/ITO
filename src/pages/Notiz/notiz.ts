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
  selector: 'page-notiz',
  templateUrl: 'notiz.html',
})
export class NotizPage {
  notiz_name
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.notiz_name = navParams.get('notiz_name')
  }

  public  submitModal(){
    let data = { 'notiz_name': this.notiz_name};
    console.log(this.notiz_name)
    this.viewCtrl.dismiss(data);
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }
}
