import { Component, OnInit } from '@angular/core';
import { NewsService } from '../news.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  articles: any;

  constructor(private newsService: NewsService, private router: Router) { 
    this.loadBBCnews();
  }

  ngOnInit() {
  }

  loadBBCnews() {
    this.newsService
    .getData("top-headlines?sources=bbc-news")
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
