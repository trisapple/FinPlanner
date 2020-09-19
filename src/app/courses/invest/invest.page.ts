import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-invest',
  templateUrl: './invest.page.html',
  styleUrls: ['./invest.page.scss'],
})
export class InvestPage implements OnInit {
  public items = [
    {
      vid:<any> 'https://www.youtube.com/embed/Jz8ISUefjkw',
      sub: 'LESSON 1',
      head: 'What is an asset class?',
      des: 'In this video, you will be learning what asset classes are.',
      time: '8 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/kI-wkjSg7mQ',
      sub: 'LESSON 2',
      head: 'Diversifying your portfolio & Understanding risk',
      des: 'In this video, you will be learning how much risk you should take depends on factors specific to your own situation. Being honest with yourself about these factors is a key to successful investing.',
      time: '18 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/Ra7zEkWOvew',
      sub: 'LESSON 3',
      head: 'How do fees impact your returns',
      des: 'In this video, you will be learning why fees have a bigger impact on your returns than you might think. Here are all the potential fees that you should be aware of.',
      time: '13 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/b3pnpbWYfwc',
      sub: 'LESSON 4',
      head: 'On trying to time the market',
      des: 'In this video, you will be learning why trying to time the market is one of the most ineffective strategies, and which strategy is better than that.',
      time: '5 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/00aPTfg3L9I',
      sub: 'LESSON 5',
      head: 'Investing Basics: Key Summary',
      des: 'In this video, we will summarise what we have gone through in the previous 4 videos.',
      time: '6 mins'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {

    this.items.map(el => el.vid = this.sanitizer.bypassSecurityTrustResourceUrl(el.vid));
    console.log(this.items);
  }

  ngOnInit() {
  }

}
