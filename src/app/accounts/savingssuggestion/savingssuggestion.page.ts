import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-savingssuggestion',
  templateUrl: './savingssuggestion.page.html',
  styleUrls: ['./savingssuggestion.page.scss'],
})
export class SavingssuggestionPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  addTodo(name) {
    let navigationExtras: NavigationExtras = {
      state: {
        remindername: name,
        reminderdate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1).toISOString()
      }
    };
    console.log(navigationExtras)
    console.log(new Date().getFullYear())
    this.router.navigate(['/todolist/add'], navigationExtras);
  }

}
