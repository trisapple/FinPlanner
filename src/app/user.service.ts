import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // User Collection
  // usersCollectionRef: AngularFirestoreCollection<any>;
  loggedin = false;
  name: String;
  email: String;
  profilePicture: String;

  constructor(public firestore: AngularFirestore) { 
    // this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  login(email: string) {
    // tslint:disable-next-line: max-line-length
    return this.firestore.collection<any>('users').doc(email).valueChanges(); // Get the email (document) of the user, so we can get the firstname, lastname, email, password
  }

  signup(name: string, email: string) {
    this.firestore.collection<any>('users').doc(email).set({name: name});
  }

  loginWithFacebook(email: string) {
    // tslint:disable-next-line: max-line-length
    return this.firestore.collection<any>('users').doc(email).valueChanges(); // Get the email (document) of the user, so we can get the name, email, password
  }

  loginWithGoogle(email: string) {
    // tslint:disable-next-line: max-line-length
    return this.firestore.collection<any>('users').doc(email).valueChanges(); // Get the email (document) of the user, so we can get the name, email, password
  }
}
