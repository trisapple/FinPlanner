import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { UserService } from '../user.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  public items = [
    {
      pic: '../../assets/plan.jpg',
      title: 'Financial Planning and Basics',
    },
    {
      pic: '../../assets/invest.jpg',
      title: 'Investing Basics',
    },
    {
      pic: '../../assets/save.png',
      title: 'Tips on Saving Money',
    },
    {
      pic: '../../assets/etf.jpg',
      title: 'How to Invest (The Right Way) with ETFs',
    },
    {
      pic: '../../assets/retire.jpg',
      title: 'How to Plan for Your Retirement',
    },
    {
      pic: '../../assets/crypto.jpg',
      title: 'Investing with Cryptocurrency',
    }
  ];


  constructor(public navCtrl: NavController, private router: Router, private userService: UserService) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        let sub: Subscription = userService.login(user.uid).subscribe((data) => {
          userService.loggedin = true;
          userService.name = data["name"];
          userService.email = user.email;
          userService.uid = user.uid;
          // userService.provider = "Email and Password"
          if (user.providerData[0]["providerId"] == "password") {
            userService.provider = "Email and Password";
          }
          if (user.providerData[0]["providerId"] == "google.com") {
            userService.socialLogin = true;
            userService.provider = "Google";
            userService.profilePicture = user.providerData[0]["photoURL"];
          }
          if (user.providerData[0]["providerId"] == "facebook.com") {
            userService.socialLogin = true;
            userService.provider = "Facebook";
            userService.profilePicture = user.providerData[0]["photoURL"];
          }
          console.log(user);
          // if (this.activatedRoute.snapshot.queryParamMap.get("connection_id")) {
          //   this.connection_id()
          // } else {
          //   this.getsaltedgedata()
          // }
          sub.unsubscribe();
        });
      } else {
        // No user is signed in.
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
  }

  gotoplan() {
    this.navCtrl.navigateForward(['/courses/planning']);
   }

  gotoinvest() {
    this.navCtrl.navigateForward(['/courses/invest']);
   }
  
  gotosave() {
    this.navCtrl.navigateForward(['/courses/save']);
   }

  gotoEtf() {
    this.navCtrl.navigateForward(['/courses/etf']);
   }

  gotoretire() {
    this.navCtrl.navigateForward(['/courses/retire']);
   }
  
   gototips() {
    this.navCtrl.navigateForward(['/courses/tips']);
   }
}
