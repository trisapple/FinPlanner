import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.page.html',
  styleUrls: ['./tips.page.scss'],
})
export class TipsPage implements OnInit {
  public items = [
    {
      vid:<any> 'https://www.youtube.com/embed/oO7r89_Kg7c',
      sub: 'LESSON 1',
      head: 'What are \'Cryptocurrency\' and \'Bitcoin\'?',
      des: 'In this video, you will be learning how they work, why investors are starting to look into them as an alternative to Gold, and why you might want to have your eyes on this disruptive technology..',
      time: '3 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/SSo_EIwHSd4',
      sub: 'LESSON 2',
      head: 'What is Blockchain and how does it work?',
      des: 'In this video, you will be learning what is blockchain and how does it work and why this may be the future for banks.',
      time: '6 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/M-qYym-i1_8',
      sub: 'LESSON 3',
      head: 'How to trade Bitcoin and Cryptocurrency?',
      des: 'In this video, you will be learning how to trade Bitcoin and Cryptocurrency and where to make your first trade.',
      time: '8 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/lHpTfYZqhwA',
      sub: 'LESSON 4',
      head: 'What are \'Altcoin\'?',
      des: 'In this video, you will be learning what are Altcoins.',
      time: '9 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/1X820c_zRdk',
      sub: 'LESSON 5',
      head: 'Investing with Cryptocurrency: Key Summary',
      des: 'In this video, we will summarise what we have gone through in the previous 5 videos.',
      time: '3 mins'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {

    this.items.map(el => el.vid = this.sanitizer.bypassSecurityTrustResourceUrl(el.vid));
    console.log(this.items);
  }

  ngOnInit() {
  }

}
