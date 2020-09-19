import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-retire',
  templateUrl: './retire.page.html',
  styleUrls: ['./retire.page.scss'],
})
export class RetirePage implements OnInit {
  public items = [
    {
      vid:<any> 'https://www.youtube.com/embed/KA66Wcp1QEc',
      sub: 'LESSON 1',
      head: 'What is retirement?',
      des: 'In this video, you will be learning how to think about planning for your retirement.',
      time: '7 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/O3nkFyTNtjw',
      sub: 'LESSON 2',
      head: 'How much money do you need?',
      des: 'In this video, you will be learning the various way you can calculate how much you will need for retirement and some of the areas where you might be spending more during retirement.',
      time: '5 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/FQ5Xcm-qMQM',
      sub: 'LESSON 3',
      head: 'IS CPF enough?',
      des: 'In this video, you will be learning how CPF works, how you can use it for your retirement planning and other financial goals.',
      time: '11 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/cjFybP49mbM',
      sub: 'LESSON 4',
      head: 'Your CPF may be insufficent for retirement',
      des: 'In this video, you will be learning why your CPF may not be sufficient for retirement.',
      time: '2 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/51uWrUP9CdQ',
      sub: 'LESSON 5',
      head: 'What is the Supplementary Retirement Scheme (SRS)?',
      des: 'In this video, you will be learning how SRS can be a great tool to grow your money. Here\' what you need to know before contributing towards it.',
      time: '11 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/ad0oRbRWrg8',
      sub: 'LESSON 6',
      head: 'How to Plan for Your Retirement: Key Summary',
      des: 'In this video, we will summarise what we have gone through in the previous 5 videos.',
      time: '14 mins'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {

    this.items.map(el => el.vid = this.sanitizer.bypassSecurityTrustResourceUrl(el.vid));
    console.log(this.items);
  }

  ngOnInit() {
  }

}
