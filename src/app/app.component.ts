import { Component } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FingerprintPage } from './fingerprint/fingerprint.page';

// import { Plugins, registerWebPlugin } from '@capacitor/core';
// import { FacebookLogin } from '@rdlabo/capacitor-facebook-login'

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
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // registerWebPlugin(FacebookLogin);
      this.platform.pause.subscribe(() => {

      });
    });
  }

  async lockApp(){
    const modal = await this.modalCtrl.create({
      component: FingerprintPage,
      backdropDismiss: false,
      cssClass: 'login-modal',
      componentProps: {
        isModal: true
      }
    });
    modal.present();
  }
}
