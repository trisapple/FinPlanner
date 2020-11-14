import { Component, OnInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase';
import { UserService } from '../user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit{
  public items: Array<{ name: string, description: string }> = [
    { 
       name : 'What is financial planning?',
       description : 'Financial planning is the process of seeking to meet your life goals through the proper management of your finances. Financial planning helps you make advance provision for financial needs that will arise in the future. The objective of financial planning is to ensure that the right amount of money is available in the right hands at the right point in the future to achieve an individual\'s life goals.',
    },
    { 
       name : 'Why should I make a financial plan?',
       description : 'Financial planning provides direction and meaning to your financial decisions. It allows you to understand how each financial decision you make affects other areas of your finances. For example, buying a particular investment product might help you save adequately to finance your child\'s higher education, or it may provide enough for a comfortable retirement. You can also adapt more easily to life changes and feel more secure that your goals are on track.',
    },
    { 
       name : 'Who is a financial planner?',
       description : 'A financial planner is someone who uses the financial planning process to help you determine how to meet your life goals. The key function of a financial planner is to help people identify their financial planning needs, their present priorities and the products that are most suitable to meet their needs. He or she normally possesses detailed knowledge of a wide range of financial planning tools and products, but his primary role is to help clients choose the best products for each need. The planner can take a “big picture” view of your financial situation and make financial planning recommendations that are right for you.',
    },
    { 
       name : 'How much should I be saving?',
       description : 'It is hard to apply a rule of thumb toward savings, because it varies with age and income level. Ten percent is a good start. If you find that is too high for you, don\'t let that deter you. You can start by putting a little aside each month and then slowly increasing it.',
    },
    { 
       name : 'What if I don\'t achieve my goals?',
       description : 'Financial planning is a common-sense approach to managing your finances to reach your life goals. It cannot change your situation overnight; it is a lifelong process. Remember that events beyond your control such as inflation or changes in the stock market or interest rates will affect your financial planning results.',
    },
    { 
       name : 'Why do I have to provide so much personal information?',
       description : 'Consider a visit to your doctor. Without complete and fully accurate details, your doctor cannot prescribe the best course of action. The same applies to financial planning. In order to obtain the best service for your “financial health,” all details and specifics must be disclosed.',
    },
    { 
       name : 'What type of information do I have to provide?',
       description : 'Typically, information regarding investments held, number of dependents, income and expenditure details, savings and financial planning needs, etc. The more accurate information you give, the better the quality of advice given.',
    },
    { 
       name : 'What should a financial plan include?',
       description : 'A financial plan should include a review of your net worth, goals and objectives, investment portfolio, cash flow, investments, retirement planning, tax planning and insurance needs, as well as a plan for implementing your goals.',
    },
    { 
       name : 'Why is there an evaluation of my insurance needs?',
       description : 'Evaluating your insurance needs is part of personal financial planning. Insurance takes care of your unpredictable needs, and because these needs can arise at any time, insurance is extremely important. Investments take care of your predictable needs and ideally should follow after your unpredictable needs are addressed. The insurance industry has changed a great deal over the past few years, and there is a whole array of new products from LIC as well as private insurance companies.',
    }
  ];

  constructor(public navCtrl: NavController, private router: Router, public userService: UserService) { 

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


  // public items: any = [];

  // expandItem(item): void {
  //   if (item.expanded) {
  //     item.expanded = false;
  //   } else {
  //     this.items.map(listItem => {
  //       if (item == listItem) {
  //         listItem.expanded = !listItem.expanded;
  //       } else {
  //         listItem.expanded = false;
  //       }
  //       return listItem;
  //     });
  //   }
  // }

  // constructor() {
  //   this.items = [
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false},
  //     { expanded: false}
  //   ];
  //  }
  ngOnInit() {
  }

  gotoaskques() {
   this.navCtrl.navigateForward(['/faq/askquestions']);
  }
}
