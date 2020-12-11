import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.page.html',
  styleUrls: ['./fingerprint.page.scss'],
})
export class FingerprintPage implements OnInit {
  @Input()isModal: boolean;

  constructor(private faio: FingerprintAIO, private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log('I am modal: ', this.isModal);
  }

  login(){
    this.faio.show({
      title: 'Biometric Authentication', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
      subtitle: 'For Login Verification,', // (Android Only) | optional | Default: null
      description: 'Please authenticate', // optional | Default: null
      fallbackButtonTitle: 'Use Pin', // optional | When disableBackup is false defaults to "Use Pin".
      // When disableBackup is true defaults to "Cancel"
      disableBackup: true,  // optional | default: false
    }).then(() => {
      if (this.isModal) {
        this.modalCtrl.dismiss().then(() => {
          this.modalCtrl.dismiss();
      })
    }
      else {
        this.router.navigateByUrl('/home');
    }
    })
    .catch((error: any) => console.log(error));
  }

}
