import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  data: any;
  articles: any;

  private selectedSegment: string;

  constructor(private newsService: NewsService, private router: Router, public navCtrl: NavController) { 

  }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    console.log(event.target.value);
    this.selectedSegment = event.target.value;
    if (event.detail.value == "localheadlines") {
      // Do something
      this.loadlocalnews();
    }
    if (event.detail.value == "topheadlines") {
      // Do something
      this.loadBBCnews();
    }
    if (event.detail.value == "finance") {
      // Do something
      this.loadbusinessnews();
    }
    if (event.detail.value == "bitcoin") {
      // Do something
      this.loadbitcoin();
    }
  }

  loadlocalnews() {
    this.newsService
    .getData("top-headlines?country=SG")
    .subscribe(news => {
      this.articles = news['articles'];
      console.log(this.articles);
    });
}

  loadBBCnews() {
      this.newsService
      .getData("top-headlines?sources=bbc-news")
      .subscribe(news => {
        this.articles = news['articles'];
        console.log(this.articles);
      });
  }

    loadbusinessnews() {
      this.newsService
      .getData("top-headlines?country=US&category=business")
      .subscribe(news => {
        this.articles = news['articles'];
        console.log(this.articles);
      });
  }

  loadbitcoin() {
     this.newsService
     .getData("everything?q=bitcoin&sortBy=publishedAt$")
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
