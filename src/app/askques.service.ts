import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AskQuesService {

  uid: string;
  username: string;
  email: string;
  ques: string;
  // usersquesCollectionRef: AngularFirestoreCollection<any>;

  constructor(public firestore: AngularFirestore) {
    // this.usersquesCollectionRef = this.firestore.collection<any>('usersques');
  }

  addUpdateContact(username: string, email: string, ques: string, uid: string){
    this.firestore.collection<any>('users').doc(uid).set({username: username, email: email, ques: ques});
    }

  deleteContact(name: string){
    this.firestore.collection<any>('users').doc(name).delete();
    }

  getContacts() {
    return this.firestore.collection<any>('users').doc().valueChanges();
    }

}