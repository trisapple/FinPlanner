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
  email: string;
  profilePicture: String;

  authorisationCode: String;
  accessToken: String;

  socialLogin = false;
  provider: String;

  citiLogin = false;

  transactions: JSON
  allaccounts: JSON
  accountsummaryArray = []
  transactionhistorytitle: String
  transactionhistoryaccountId: String

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

  // loginWithFacebook(email: string) {
  // tslint:disable-next-line: max-line-length
  //   return this.firestore.collection<any>('users').doc(email).valueChanges(); // Get the email (document) of the user, so we can get the name, email, password
  // }

  // loginWithGoogle(email: string) {
  // tslint:disable-next-line: max-line-length
  //   return this.firestore.collection<any>('users').doc(email).valueChanges(); // Get the email (document) of the user, so we can get the name, email, password
  // }
}
