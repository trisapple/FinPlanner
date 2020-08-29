import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TodoListService } from '../todo-list.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  constructor(public navCtrl: NavController, public todolistService: TodoListService, public firestore: AngularFirestore, public userService: UserService) {
    
  }

  ngOnInit() {
    if (this.userService.loggedin) {
      this.todolistService.getTodo()
    }
  }

  addTodo() {
    this.navCtrl.navigateForward(['/todolist/add']);
  }

  updateTodo(each, i) {
    // Put the reminder properties into global variables which will be accessed by the update todo page
    this.todolistService.name = each.name
    this.todolistService.date = each.dueDate.toDate().toISOString()
    this.todolistService.index = i // Position of todo in todolistService.todoList array
    this.navCtrl.navigateForward(['/todolist/update']);
  }

  deleteTodo(index) {
    this.todolistService.todoList.splice(index, 1)

    // Update the user's todoList with the newly added todo added to the todoList array
    this.firestore.collection<any>('users').doc(this.userService.email).update({
      todolist: this.todolistService.todoList
    })
      // After it is updated, refresh the todolist and go back.
      .then(value => {
        this.todolistService.getTodo()
        this.navCtrl.pop()
      })
      // Log and catch the error
      .catch(value => {
        console.log(value)
      })
  }

}
