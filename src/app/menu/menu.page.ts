import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Expenses',
      url: '/expenses',
      icon: 'wallet'
    },
    {
      title: 'Courses',
      url: '/expenses',
      icon: 'school'
    },
    {
      title: 'FAQ',
      url: '/faq',
      icon: 'help'
    },
    {
      title: 'Login / Sign Up',
      url: '/login',
      icon: 'person'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
