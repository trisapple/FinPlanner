import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { UserService } from '../user.service';


@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  data: any;
  articles: any;

  private selectedSegment: string;

  constructor(private newsService: NewsService, private router: Router, public navCtrl: NavController, public userService: UserService) {
    this.selectedSegment = "localheadlines"
    this.loadlocalnews();

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

  segmentChanged(event: any) {
    console.log(event.target.value);
    this.selectedSegment = event.target.value;
    if (event.detail.value == "localheadlines") {
      this.loadlocalnews();
    }
    if (event.detail.value == "topheadlines") {
      this.loadBBCnews();
    }
    if (event.detail.value == "finance") {
      this.loadbusinessnews();
    }
    if (event.detail.value == "bitcoin") {
      this.loadbitcoin();
    }
    if (event.detail.value == "covid") {
      this.loadcovid();
    }
  }

  loadlocalnews() {
    this.newsService.getData("top-headlines?country=SG")
  }

  loadBBCnews() {
    this.newsService.getData("top-headlines?sources=bbc-news")
  }

  loadbusinessnews() {
    this.newsService.getData("top-headlines?country=US&category=business")
  }

  loadbitcoin() {
    this.newsService.getData("everything?q=bitcoin&sortBy=publishedAt$")
  }

  loadcovid() {
    this.newsService.getData("everything?q=coronavirus")
  }

  onGoToNewsSinglePage(article) {
    this.newsService.currentArticle = article;
    this.router.navigate(['/news-single']);
  }
}
