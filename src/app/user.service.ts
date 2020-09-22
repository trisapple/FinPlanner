import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ExpensesService } from './expenses.service';
import { SaltedgeService } from './saltedge.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // User Collection
  // usersCollectionRef: AngularFirestoreCollection<any>;

  loggedin = false; // Check if the user is logged in
  name: String;
  email: string;
  uid: string;
  profilePicture: String;

  // Citibank
  citiauthorisationCode: String; // Authorisation code used to get the access token
  citiaccessToken: String; // Access Token saved for API requests
  citiLogin = false; // Check if the user has connected their account with Citi (to show Connected or Connect)

  // OCBC
  ocbcaccessToken: String;
  ocbcLogin = false;

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
