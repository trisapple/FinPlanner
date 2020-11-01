import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from '../user.service';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';



@Component({
  selector: 'app-exchangerates',
  templateUrl: './exchangerates.page.html',
  styleUrls: ['./exchangerates.page.scss'],
})
export class ExchangeratesPage implements OnInit {
  articles: any;

  constructor(public navCtrl: NavController, public userService: UserService,private newsService: NewsService, private router: Router) {
   this.loadbusinessnews()
   }

  ngOnInit() {
  }

  stocks() {
    this.navCtrl.navigateForward(['/exchangerates/stocks']);
  }

  fxrates() {
    this.navCtrl.navigateForward(['/exchangerates/fxrates']);
  }

  crypto() {
    this.navCtrl.navigateForward(['/exchangerates/crypto']);
  }

  Login() {
    this.navCtrl.navigateForward(['/login'])
  }

  rates() {
    this.navCtrl.navigateForward(['/exchangerates/rates'])
  }

//   loadBBCnews() {
//     this.newsService
//     .getData("top-headlines?country=us&category=business")
//     .subscribe(news => {
//       this.articles = news['articles'];
//       console.log(this.articles);
//     });
// }

loadbusinessnews() {
  this.newsService
  .getData("top-headlines?country=US&category=business")
  .subscribe(news => {
    this.articles = news['articles'];
    console.log(this.articles);
  });
}

onGoToNewsSinglePage(article) {
  this.newsService.currentArticle = article;
  this.router.navigate(['/news-single']);
}

 
}
