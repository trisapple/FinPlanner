import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {

  todoList = []

  constructor(public firestore: AngularFirestore) {
    // this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  gettodoList() {
    return this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").valueChanges();
  }
}
