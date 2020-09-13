import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})
export class PlanningPage implements OnInit {
  public items = [
    {
      vid: 'https://www.youtube.com/embed/ggv21pNgbtM',
      sub: 'LESSON 1',
      head: 'What is Financial Planning?',
      des: 'In this video, you will be learning what is financial planning.',
      time: '3 mins'
    },
    {
      vid: 'https://www.youtube.com/embed/aXDuLxEJqBo',
      sub: 'LESSON 2',
      head: 'How to set and prioritise your financial goals',
      des: 'In this video, you will be learning how to set achievable goals and prioritise them.',
      time: '5 mins'
    },
    {
      vid: 'https://www.youtube.com/embed/SR8-qWu549c',
      sub: 'LESSON 3',
      head: 'How to put your financial plan into action',
      des: 'In this video, you will be learning how to put your plan into action and achieving them.',
      time: '6 mins'
    },
    {
      vid: 'https://www.youtube.com/embed/CU4l_rs50Kk',
      sub: 'LESSON 4',
      head: 'Financial Planning Basics: Key Summary',
      des: 'In this video, we will summarise what we have gone through in the previous 3 videos.',
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
