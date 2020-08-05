import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public userService: UserService, private router: Router) { 
    if (userService.socialLogin == false) {
      this.userService.profilePicture = 'assets/avatar.png'
    }
  }

  ngOnInit() {
  }
  
  changePassword() {
    this.router.navigateByUrl('/changepassword');
  }
}
