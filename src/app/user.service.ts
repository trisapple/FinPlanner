import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // User Collection
  // usersCollectionRef: AngularFirestoreCollection<any>;

  loggedin = false; // Check if the user is logged in
  name: String;
  email: string;
  profilePicture: String;

  // Citibank
  authorisationCode: String; // Authorisation code used to get the access token
  accessToken: String; // Access Token saved for API requests
  citiLogin = false; // Check if the user has connected their account with Citi (to show Connected or Connect)

  // OCBC
  ocbcLogin = false;

  socialLogin = false; // Check if the user has used facebook or google to login
  provider: String; // Provider name (facebook, google) to show on profile screen

  constructor(public firestore: AngularFirestore) {
    // this.usersCollectionRef = this.firestore.collection<any>('users'); // Get the 'users' collection in Firebase Cloud Firestore
  }

  login(email: string) {
    // tslint:disable-next-line: max-line-length
    return this.firestore.collection<any>('users').doc(email).valueChanges(); // Get the email (document) of the user, so we can get the firstname, lastname, email, password
  }

  signup(name: string, email: string) {
    this.firestore.collection<any>('users').doc(email).set({name});
  }

  updateProfile(name: string) {
    this.firestore.collection<any>('users').doc(this.email).set({name});
    this.name = name;
  }

  deleteAccount(email: string) {
    this.firestore.collection<any>('users').doc(email).delete();
    this.loggedin = false;
  }
}
