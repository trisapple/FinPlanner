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
  page = 1;
  articles: any;

  private selectedSegment: string;
  // private bitcoinSegment: string = 'bitcoin'
  constructor(private newsService: NewsService, private router: Router, public navCtrl: NavController) { 
    this.loadBBCnews();
    this.loadbitcoin();
  }

  ngOnInit() {
  }

  segmentChanged(event: any) {
    console.log(event.target.value);
    this.selectedSegment = event.target.value;
  }

  loadBBCnews() {
      this.newsService
      .getData("top-headlines?sources=bbc-news")
      .subscribe(news => {
        this.articles = news['articles'];
        console.log(this.articles);
      });
  }

  loadbitcoin() {
      this.newsService
        .getData(
          `everything?q=bitcoin&sortBy=publishedAt${
            this.page
          }`
        )
        .subscribe(data => {
          this.articles = data['articles'];
          console.log(this.articles);
          this.data = data;
        });
  }

  onGoToNewsSinglePage(article) {
    this.newsService.currentArticle = article;
    this.router.navigate(['/news-single']);
  }


}
