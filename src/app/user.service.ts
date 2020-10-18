import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ExpensesService } from './expenses.service';
import { SaltedgeService } from './saltedge.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedin = false; // Check if the user is logged in
  name: String;
  email: string;
  uid: string;
  profilePicture: String;

  socialLogin = false; // Check if the user has used facebook or google to login
  provider: String; // Provider name (facebook, google) to show on profile screen

  constructor(public firestore: AngularFirestore, public expensesService: ExpensesService, public saltedgeService: SaltedgeService) {
    // this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  login(email: string) {
    // tslint:disable-next-line: max-line-length
    return this.firestore.collection<any>('users').doc(email).valueChanges(); // Get the email (document) of the user, so we can get the firstname, lastname, email, password
  }

  signup(name: string, email: string, uid: string) {
    this.firestore.collection<any>('users').doc(uid).set({name: name, email: email});
  }

  updateProfile(name: string) {
    this.firestore.collection<any>('users').doc(this.email).set({name});
    this.name = name;
  }

  deleteAccount(uid: string) {
    this.firestore.collection<any>('users').doc(uid).delete();
    this.name = ""
    this.email = ""
    this.uid = ""
    this.saltedgeService.saltedgecustomerid = ""
    this.loggedin = false;
  }
}
