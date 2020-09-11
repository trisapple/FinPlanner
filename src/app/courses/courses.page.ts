import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  // public cards: Array<{ title: string, subtitle: string, description: string }> = [
  //   { 
  //      title : 'What is financial planning?',
  //      subtitle: 'Hello',
  //      description : 'Financial planning is the process of seeking to meet your life goals through the proper management of your finances. Financial planning helps you make advance provision for financial needs that will arise in the future. The objective of financial planning is to ensure that the right amount of money is available in the right hands at the right point in the future to achieve an individual\'s life goals.',
  //   },
  //   { 
  //      title : 'Why should I make a financial plan?',
  //      subtitle: 'Mary',
  //      description : 'Financial planning provides direction and meaning to your financial decisions. It allows you to understand how each financial decision you make affects other areas of your finances. For example, buying a particular investment product might help you save adequately to finance your child\'s higher education, or it may provide enough for a comfortable retirement. You can also adapt more easily to life changes and feel more secure that your goals are on track.',
  //   },

  // ];
  constructor() { }

  ngOnInit() {
  }

}
