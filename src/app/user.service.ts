import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // User Collection
  // usersCollectionRef: AngularFirestoreCollection<any>;
  loggedin = false;
  firstname: String;
  lastname: String;
  email: String;

  constructor(public firestore: AngularFirestore) { 
    // this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  login(email: string) {
    // tslint:disable-next-line: max-line-length
    return this.firestore.collection<any>('users').doc(email).valueChanges(); // Get the email (document) of the user, so we can get the firstname, lastname, email, password
  }

  signup(firstname: string, lastname: String, email: string) {
    this.firestore.collection<any>('users').doc(email).set({firstname: firstname, lastname: lastname});
  }
}
