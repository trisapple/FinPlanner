import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // User Collection
  usersCollectionRef: AngularFirestoreCollection<any>;
  loggedin = false;

  constructor(public firestore: AngularFirestore) { 
    this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  signup(firstname: string, lastname: String, email: string) {
    this.usersCollectionRef.doc(email).set({firstname: firstname, lastname: lastname}); 
  }
}
