import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from '../user.service';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';


@Component({
  selector: 'app-finance',
  templateUrl: './finance.page.html',
  styleUrls: ['./finance.page.scss'],
})
export class FinancePage implements OnInit {
  articles: any;

  constructor(public navCtrl: NavController, public userService: UserService, private newsService: NewsService, private router: Router) {

    this.loadbusinessnews()

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

  // stocks() {
  //   this.navCtrl.navigateForward(['/exchangerates/stocks']);
  // }

  // fxrates() {
  //   this.navCtrl.navigateForward(['/finance/fxrates']);
  // }

  // crypto() {
  //   this.navCtrl.navigateForward(['/exchangerates/crypto']);
  // }

  // Login() {
  //   this.navCtrl.navigateForward(['/login'])
  // }

  rates() {
    this.navCtrl.navigateForward(['/finance/rates'])
  }

loadbusinessnews() {
  this.newsService.getData("top-headlines?country=US&category=business")
}

onGoToNewsSinglePage(article) {
  this.newsService.currentArticle = article;
  this.router.navigate(['/news-single']);
}
}
