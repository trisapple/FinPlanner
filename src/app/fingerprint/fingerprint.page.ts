import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.page.html',
  styleUrls: ['./fingerprint.page.scss'],
})
export class FingerprintPage implements OnInit {

  transactionhistory = false

  constructor(private storage: Storage) { 
    storage.get('fingerprintTransactionHistory').then((val) => {
      console.log(val);
      this.transactionhistory = val
    });
  }

  ngOnInit() {
  }

  transactionhistoryToggle(event) {
    console.log(event.detail.checked)
    this.storage.set('fingerprintTransactionHistory', event.detail.checked);
  }

}
