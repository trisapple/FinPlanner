import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  todoList = []

  constructor(public firestore: AngularFirestore) {
    // this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  getTodo() {
    let sub: Subscription = this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").valueChanges().subscribe((data) => {
      console.log(data)
      if (data["todoList"] == undefined) {
        console.log("Data undefined run")
        this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").update({todolist: this.todoList})
      }
      this.todoList = data["todolist"]
      console.log(this.todoList)
      for (let each of this.todoList) {
        console.log(each)
        console.log(each.name)
        console.log(each.dueDate)
      }
      // this.userService.loggedin = true;
      // this.userService.name = data["name"];
      // this.userService.email = this.email;
      // this.userService.provider = "Email and Password";

      sub.unsubscribe();
    });
  }

  // gettodoList() {
  //   return this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").valueChanges();
  // }
}
