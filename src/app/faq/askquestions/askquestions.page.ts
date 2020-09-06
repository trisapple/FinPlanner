import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AskQuesService } from 'src/app/askques.service';
import { UserService } from 'src/app/user.service';
import { FormBuilder, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-askquestions',
  templateUrl: './askquestions.page.html',
  styleUrls: ['./askquestions.page.scss'],
})
export class AskquestionsPage implements OnInit {

  myForm: FormGroup;
  msg: string;

  constructor(public navCtrl: NavController,public builder: FormBuilder, public firestore: AngularFirestore, public askquesService: AskQuesService, public toastCtrl: ToastController, public userService: UserService) {
    this.myForm = builder.group({
      username: '',
      email: '',
      ques : '',
      });
  }

  ngOnInit() {
  }

  clickInsert(res) {
    if (this.myForm.value.username != "" && this.myForm.value.email !="" && this.myForm.value.ques !="") {
      this.askquesService.addUpdateContact(this.askquesService.username, this.askquesService.email, this.askquesService.ques, res.user.uid);
      this.presentToast('Question sent successfully');
      }
      else {
      this.presentToast('Please fill in all text fields');
      }
  }

 clickView () {
  this.navCtrl.push (QueslistPage);
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();

  }
}
