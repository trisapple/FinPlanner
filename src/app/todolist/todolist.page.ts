import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TodoListService } from '../todo-list.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  constructor(public navCtrl: NavController, public todolistService: TodoListService) { }

  ngOnInit() {

    let sub: Subscription = this.todolistService.gettodoList().subscribe((data) => {
      this.todolistService.todoList = data["todolist"]
      console.log(this.todolistService.todoList)
      for (let each of this.todolistService.todoList) {
        console.log(each)
        console.log(each.name)
        console.log(each.dueDate.toDate())
      }
      // this.userService.loggedin = true;
      // this.userService.name = data["name"];
      // this.userService.email = this.email;
      // this.userService.provider = "Email and Password";

      sub.unsubscribe();
    });
  }

  addTodo() {
    this.navCtrl.navigateForward(['/todolist/add']);
  }

}
