import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-spendinginsights',
  templateUrl: './spendinginsights.page.html',
  styleUrls: ['./spendinginsights.page.scss'],
})
export class SpendingInsightsPage implements OnInit {

  constructor(public navCtrl: NavController, private activatedRoute: ActivatedRoute, private userService: UserService, private expensesService: ExpensesService) { 

  }

  ngOnInit() {
  }

  // Onclick to next page, passing account information to the next page
  expensessummary(account) {
    // this.expensesService.transactionhistorytitle = account.productName
    this.expensesService.transactionhistoryaccountId = account.accountId // Store the account id in a global variable so that the next page can fetch the transaction details and show the expenses summary
    this.navCtrl.navigateForward(['/spendinginsights//expensessummary']); // Navigate to the next page
  }

}
