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
      vid:<any> 'https://www.youtube.com/embed/ggv21pNgbtM',
      sub: 'LESSON 1',
      head: 'What is retirement?',
      des: 'In this video, you will be learning how to think about planning for your retirement.',
      time: '3 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/aXDuLxEJqBo',
      sub: 'LESSON 2',
      head: 'How much money do you need?',
      des: 'In this video, you will be learning the various way you can calculate how much you will need for retirement and some of the areas where you might be spending more during retirement.',
      time: '5 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/SR8-qWu549c',
      sub: 'LESSON 3',
      head: 'IS CPF enough?',
      des: 'In this video, you will be learning how CPF works, how you can use it for your retirement planning and other financial goals.',
      time: '6 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/CU4l_rs50Kk',
      sub: 'LESSON 4',
      head: 'If your CPF is insufficent',
      des: 'In this video, you will be learning why your CPF may not be sufficient for retirement.',
      time: '3 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/CU4l_rs50Kk',
      sub: 'LESSON 5',
      head: 'What is the Supplementary Retirement Scheme (SRS)?',
      des: 'In this video, you will be learning how SRS can be a great tool to grow your money. Here\' what you need to know before contributing towards it.',
      time: '3 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/CU4l_rs50Kk',
      sub: 'LESSON 6',
      head: 'How to Plan for Your Retirement: Key Summary',
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
