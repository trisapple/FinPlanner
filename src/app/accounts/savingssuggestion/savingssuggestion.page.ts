import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-savingssuggestion',
  templateUrl: './savingssuggestion.page.html',
  styleUrls: ['./savingssuggestion.page.scss'],
})
export class SavingssuggestionPage implements OnInit {

  month = ""
  year = ""
  spendinginsightlabels = []

  savingssuggestionsobject = {}
  savingssuggestionsarray = []

  constructor(private router: Router, private route: ActivatedRoute) { }

  // {"Cafes & Restaurants": ["Eat at Coffee Shop", "Cook at home"]}
  // [[["Cafes & Restaurants"], ["Eat at Coffee Shop", "Cook at home"]], 
  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.month = this.router.getCurrentNavigation().extras.state.month;
      this.year = this.router.getCurrentNavigation().extras.state.year;
      this.spendinginsightlabels = this.router.getCurrentNavigation().extras.state.spendinginsightlabels;
    }
    console.log(this.spendinginsightlabels)
    for (let each of this.spendinginsightlabels) {
      if (each == "Cafes And Restaurants") {
        this.savingssuggestionsobject[each] = ["Eat at Coffee Shop", "Cook at home"]
      }
      if (each == "Electronics And Software") {
        this.savingssuggestionsobject[each] = ["Buy refurbished or used technology products"]
      }
      if (each == "Shopping") {
        this.savingssuggestionsobject[each] = ["Make a wish list", "Shop in Carousell"]
      }
      if (each == "Groceries") {
        this.savingssuggestionsobject[each] = ["Buy only what you need"]
      }
    }
    this.savingssuggestionsarray = Object.entries(this.savingssuggestionsobject)
    console.log(this.savingssuggestionsobject)
    console.log(this.savingssuggestionsarray)
  }

  addTodo(name) {
    let navigationExtras: NavigationExtras = {
      state: {
        remindername: name,
        reminderdate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toISOString()
      }
    };
    console.log(navigationExtras)
    this.router.navigate(['/todolist/add'], navigationExtras);
  }

}
