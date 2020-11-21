import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {
  courses: any
  // public items = [
  //   {
  //     title: 'Financial Planning and Basics',
  //   },
  //   {
  //     title: 'Investing Basics',
  //   },
  //   {
  //     title: 'Tips on Saving Money',
  //   },
  //   {
  //     title: 'How to Invest (The Right Way) with ETFs',
  //   },
  //   {
  //     title: 'How to Plan for Your Retirement',
  //   },
  //   {
  //     title: 'Investing with Cryptocurrency',
  //   }
  // ];


  constructor(public navCtrl: NavController, private router: Router, private userService: UserService, public coursesService: CoursesService) {

    this.coursesService.Lessons().subscribe(data => {
      this.courses = data.map(e => {
        return {
          id: e.payload.doc.id,
          picture: e.payload.doc.data()['picture'],
          title: e.payload.doc.data()['title'],
          lessons: e.payload.doc.data()['lessons'],
        };

      });
      console.log(this.courses);
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        let sub: Subscription = userService.login(user.uid).subscribe((data) => {
          userService.loggedin = true;
          userService.name = data["name"];
          userService.email = user.email;
          userService.uid = user.uid;
          // userService.provider = "Email and Password"
          if (user.providerData[0]["providerId"] == "password") {
            userService.provider = "Email and Password";
          }
          if (user.providerData[0]["providerId"] == "google.com") {
            userService.socialLogin = true;
            userService.provider = "Google";
            userService.profilePicture = user.providerData[0]["photoURL"];
          }
          if (user.providerData[0]["providerId"] == "facebook.com") {
            userService.socialLogin = true;
            userService.provider = "Facebook";
            userService.profilePicture = user.providerData[0]["photoURL"];
          }
          console.log(user);
          // if (this.activatedRoute.snapshot.queryParamMap.get("connection_id")) {
          //   this.connection_id()
          // } else {
          //   this.getsaltedgedata()
          // }
          sub.unsubscribe();
        });
      } else {
        // No user is signed in.
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {
  }

  gotoplan(obj) {
    console.log(obj);
    let navigationExtras: NavigationExtras = {
      state: {
        title: obj
      }
    };
    this.router.navigate(['/courses/planning'], navigationExtras);
    // this.navCtrl.navigateForward(['/courses/planning']);
  }



}
