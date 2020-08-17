import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserService } from '../user.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
})
export class UpdateprofilePage implements OnInit {

  name = '';
  email = '';

  constructor(public toastCtrl: ToastController, public userService: UserService, public navCtrl: NavController) { }

  ngOnInit() {
  }

  async updateProfile() {
    if (this.name == "") { // If name is null
      this.presentToast('Please enter all fields!', 'middle', 2000);
    }
    else { // Will be executed if name is not null
      this.userService.updateProfile(this.name);
      const toast = this.toastCtrl.create({
        message: 'Updated Successfully!',
        position: 'middle',
        duration: 2000
      });
      this.navCtrl.pop();
      (await toast).present();
    }
  }

  async presentToast(message, position, duration) {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

}
