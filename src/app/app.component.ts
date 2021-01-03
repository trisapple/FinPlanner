import { Component } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FingerprintLockPage } from '../app/fingerprint-lock/fingerprint-lock.page';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.pause.subscribe(() => {
        this.storage.get('fingerprintLogin').then((val) => {
          console.log(val);
          if ((this.platform.is('hybrid')) && val == true) {
            this.lockApp()
          }
        });
      });
    });
  }

  async lockApp(){
    const modal = await this.modalCtrl.create({
      component: FingerprintLockPage,
      backdropDismiss: false,
      cssClass: 'lock',
      componentProps: {
        isModal: true
      }
    });
    modal.present()
  }

}
