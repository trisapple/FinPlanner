import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public userService: UserService) { 
    if (userService.socialLogin == false) {
      this.userService.profilePicture = 'assets/avatar.png'
    }
  }

  ngOnInit() {
    
  }

}
