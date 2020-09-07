import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  firetodoList = []
  localtodoList = []

  // Update todo
  name: String
  date: string
  index: any
  checked: Boolean

  constructor(public firestore: AngularFirestore, public userService: UserService) {
    // this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  getTodo() {
    let sub: Subscription = this.firestore.collection<any>('users').doc(this.userService.uid).valueChanges().subscribe((data) => {
      console.log(data)
      console.log(this.userService.uid)
      console.log(data["todolist"])

      // If the user has no todolist variable, create it for them
      if (data["todolist"] == undefined) {
        console.log("Data undefined run")
        this.firestore.collection<any>('users').doc(this.userService.uid).update({
          todolist: this.firetodoList
        })
      }

      // If the user has an existing todolist variable, put it into the todoList array to display it in html.
      else {
        this.firetodoList = data["todolist"]
        this.localtodoList = [...this.firetodoList]
      }

      // For logging
      console.log(this.firetodoList)
      for (let each of this.firetodoList) {
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
