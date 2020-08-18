import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})

export class MenuPage implements OnInit {

  // pages = [
  //   {
  //     title: 'Home',
  //     url: '/home',
  //     icon: 'home'
  //   },
  //   {
  //     title: 'Expenses',
  //     url: '/expenses',
  //     icon: 'wallet'
  //   },
  //   {
  //     title: 'Courses',
  //     url: '/courses',
  //     icon: 'school'
  //   },
  //   {
  //     title: 'FAQ',
  //     url: '/faq',
  //     icon: 'help'
  //   },
  //   {
  //     title: 'Login / Register',
  //     url: '/login',
  //     icon: 'person'
  //   },
  // ]

  constructor(public userService: UserService, private fireauth: AngularFireAuth) { }

  ngOnInit() {
  }

  signout() {
    this.userService.loggedin = false;
    this.userService.socialLogin = false;
    this.fireauth.signOut();
  }

}
