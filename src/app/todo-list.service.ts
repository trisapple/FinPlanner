import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  todoList = []

  // Update todo
  name: String
  date: string
  index: any

  constructor(public firestore: AngularFirestore) {
    // this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  getTodo() {
    let sub: Subscription = this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").valueChanges().subscribe((data) => {
      console.log(data)

      // If the user has no todolist variable, create it for them
      if (data["todolist"] == undefined) {
        console.log("Data undefined run")
        this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").update({
          todolist: this.todoList
        })
      }

      // If the user has an existing todolist variable, put it into the todoList array to display it in html.
      else {
        this.todoList = data["todolist"]
      }

      // For logging
      console.log(this.todoList)
      for (let each of this.todoList) {
        console.log(each)
        console.log(each.name)
        console.log(each.dueDate)
      }

      sub.unsubscribe();
    });
  }

  // gettodoList() {
  //   return this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").valueChanges();
  // }
}
