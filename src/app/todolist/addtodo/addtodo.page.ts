import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { TodoListService } from 'src/app/todo-list.service';
import { Time } from '@angular/common';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {

  name: String
  date: Date
  time: Time

  constructor(public navCtrl: NavController, public firestore: AngularFirestore, public todolistService: TodoListService) { 

  }

  ngOnInit() {
  }

  addTodo() {
    var todo = {} // Temporary New todo Object
    console.log(this.todolistService.todoList)
    todo["name"] = this.name // Set the name of the New todo Object
    todo["dueDate"] = new Date() // Set the date of the New todo Object to today's date for now
    this.todolistService.todoList.push(todo) // Add the newly added todo to the todoList array
    
    // For logging
    console.log(todo["dueDate"])
    console.log(todo)
    console.log(this.name)
    console.log(this.date)
    console.log(this.time)

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
