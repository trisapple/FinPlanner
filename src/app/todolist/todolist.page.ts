import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TodoListService } from '../todo-list.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  constructor(public navCtrl: NavController, public todolistService: TodoListService, public firestore: AngularFirestore) {
    
  }

  ngOnInit() {
    this.todolistService.getTodo()
  }

  addTodo() {
    this.navCtrl.navigateForward(['/todolist/add']);
  }

  deleteTodo(index) {
    this.todolistService.todoList.splice(index, 1)

    // Update the user's todoList with the newly added todo added to the todoList array
    this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").update({
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
