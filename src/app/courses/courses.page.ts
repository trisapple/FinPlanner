import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  public items = [
    {
      pic: '../../assets/plan.jpg',
      title: 'Financial Planning and Basics',
    },
    {
      pic: '../../assets/invest.jpg',
      title: 'Investing Basics',
    },
    {
      pic: '../../assets/save.png',
      title: 'Tips on Saving Money',
    },
    {
      pic: '../../assets/etf.jpg',
      title: 'How to Invest (The Right Way) with ETFs',
    },
    {
      pic: '../../assets/retire.jpg',
      title: 'How to Plan for Your Retirement',
    },
    {
      pic: '../../assets/crypto.jpg',
      title: 'Investing with Cryptocurrency',
    }
  ];


  constructor(public navCtrl: NavController, private router: Router) {}

  ngOnInit() {
  }

  gotoplan() {
    this.navCtrl.navigateForward(['/courses/planning']);
   }

  gotoinvest() {
    this.navCtrl.navigateForward(['/courses/invest']);
   }
  
  gotosave() {
    this.navCtrl.navigateForward(['/courses/save']);
   }

  gotoEtf() {
    this.navCtrl.navigateForward(['/courses/etf']);
   }

  gotoretire() {
    this.navCtrl.navigateForward(['/courses/retire']);
   }
  
   gototips() {
    this.navCtrl.navigateForward(['/courses/tips']);
   }
}
