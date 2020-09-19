import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-save',
  templateUrl: './save.page.html',
  styleUrls: ['./save.page.scss'],
})
export class SavePage implements OnInit {
  public items = [
    {
      vid:<any> 'https://www.youtube.com/embed/HQzoZfc3GwQ',
      sub: 'LESSON 1',
      head: 'Set a goal on how to save',
      des: 'In this video, you will be learning how to set a goal on how to save.',
      time: '7 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/i-2d2BRtbz8',
      sub: 'LESSON 2',
      head: 'Cut down on your expenses',
      des: 'In this video, you will be learning the various way you can cut down on your expenses.',
      time: '5 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/Cu2rgy6Ba-4',
      sub: 'LESSON 3',
      head: 'Other ways to save money',
      des: 'In this video, you will be learning other ways to save money.',
      time: '12 mins'
    },
    {
      vid:<any> 'https://www.youtube.com/embed/Z0FAQvfwcoA',
      sub: 'LESSON 4',
      head: 'Tips on Saving Money: Key Summary',
      des: 'In this video, we will summarise what we have gone through in the previous 3 videos.',
      time: '9 mins'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {

    this.items.map(el => el.vid = this.sanitizer.bypassSecurityTrustResourceUrl(el.vid));
    console.log(this.items);
  }

  ngOnInit() {
  }

}
