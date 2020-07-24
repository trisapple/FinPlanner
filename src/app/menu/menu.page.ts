import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { User } from 'firebase';

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
      url: '/courses',
      icon: 'school'
    },
    {
      title: 'FAQ',
      url: '/faq',
      icon: 'help'
    },
    {
      title: 'Login / Register',
      url: '/login',
      icon: 'person'
    },
  ]

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
