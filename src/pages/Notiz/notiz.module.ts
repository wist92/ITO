import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotizPage } from './notiz';

@NgModule({
  declarations: [
    NotizPage,
  ],
  imports: [
    IonicPageModule.forChild(NotizPage),
  ],
})
export class ModalPageModule {}
