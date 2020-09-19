import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-etf',
  templateUrl: './etf.page.html',
  styleUrls: ['./etf.page.scss'],
})
export class ETFPage implements OnInit {
  public items = [
    {
      vid:<any> 'https://www.youtube.com/embed/z-2ah1Sj1ps',
      sub: 'LESSON 1',
      head: 'Asset allocation vs. Securities selection',
      des: 'In this video, you will be learning why you should focus on asset allocation, not securities selection.',
      time: '19 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/7gkQHSW3hkE',
      sub: 'LESSON 2',
      head: 'How to get exposure to different asset classes',
      des: 'In this video, you will be learning how to get exposure to different asset classes and also what you should consider when deciding on an asset class mix.',
      time: '11 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/w7iJJn2aQnM',
      sub: 'LESSON 3',
      head: 'How to pick the right ETFs',
      des: 'In this video, you will be learning how to pick the right ETFs as there are plently of ETFs from which you choose. However, some ETFs are a better choice than others.',
      time: '4 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/VYxUUrVjUEM',
      sub: 'LESSON 4',
      head: 'How to build an efficient portfolio',
      des: 'In this video, you will be learning how to build an efficent portfolio.',
      time: '4 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/a8TnAk8abFo',
      sub: 'LESSON 5',
      head: 'How to Invest with ETFs: Key Summary',
      des: 'In this video, we will summarise what we have gone through in the previous 4 videos.',
      time: '4 mins'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {

    this.items.map(el => el.vid = this.sanitizer.bypassSecurityTrustResourceUrl(el.vid));
    console.log(this.items);
  }

  ngOnInit() {
  }

}
