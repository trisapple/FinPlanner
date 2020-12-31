import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.page.html',
  styleUrls: ['./fingerprint.page.scss'],
})
export class FingerprintPage implements OnInit {

  fingerprintTransactionHistory = false
  // appLogin = false

  constructor(private storage: Storage) { 
    storage.get('fingerprintTransactionHistory').then((val) => {
      console.log(val);
      this.fingerprintTransactionHistory = val
    });
    // storage.get('fingerprintLogin').then((val) => {
    //   console.log(val);
    //   this.appLogin = val
    // });
  }

  ngOnInit() {
  }

  toggle(key, event) {
    console.log(event.detail.checked)
    this.storage.set(key, event.detail.checked);
  }

}
