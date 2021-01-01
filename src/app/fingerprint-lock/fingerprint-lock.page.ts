import { Component, OnInit } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-fingerprint-lock',
  templateUrl: './fingerprint-lock.page.html',
  styleUrls: ['./fingerprint-lock.page.scss'],
})
export class FingerprintLockPage implements OnInit {

  constructor(private faio: FingerprintAIO, public platform: Platform, private storage: Storage, public navCtrl: NavController, public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  unlock() {
    this.faio.show({
      title: 'Biometric Authentication', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
      subtitle: 'For Login Verification,', // (Android Only) | optional | Default: null
      description: 'Please authenticate', // optional | Default: null
      fallbackButtonTitle: 'Use Pin', // optional | When disableBackup is false defaults to "Use Pin".
      // When disableBackup is true defaults to "Cancel"
      disableBackup: true,  // optional | default: false
    }).then(() => {
      this.modalCtrl.dismiss()
    })
      .catch((error: any) => console.log(error));
  }

}
