import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  data: any;
  uid: string;
  lessons: { id: string; link: string; sub: string; head: string; des: string; time: string; };
  picture: string;
  title: string;

  constructor(public firestore: AngularFirestore) { }

  Lessons() {
    // tslint:disable-next-line: max-line-length
    return this.firestore.collection('courses').snapshotChanges() // Get the email (document) of the user, so we can get the firstname, lastname, email, password

  }

  getLessons() {
    return this.firestore.collection('/courses/').snapshotChanges().subscribe(res => {
      res.map(e => {
        return {
          id: e.payload.doc.id,
          link: e.payload.doc.data()['link'],
          sub: e.payload.doc.data()['sub'],
          head: e.payload.doc.data()['head'],
          des: e.payload.doc.data()['des'],
          time: e.payload.doc.data()['time']

        };
      });
    });

  }

  getCourses(id) {
    // return this.firestore.collection('courses').doc(id).valueChanges()
    return this.firestore.collection('courses').doc(id).snapshotChanges();

  }

}
