import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  data: any;
  uid: string;
  lessons: { id: string; link: String; sub: string; head: string; des: string; time: string; };
  picture: string;
  title: string;

  constructor(public firestore: AngularFirestore, private sanitizer: DomSanitizer) { }

  Lessons() {
    // tslint:disable-next-line: max-line-length
    return this.firestore.collection('courses').snapshotChanges() // Get the email (document) of the user, so we can get the firstname, lastname, email, password

  }

  // getLessons() {
  //   this.firestore.collection('/courses/').snapshotChanges().subscribe(res => {
  //     res.map(e => {
  //       return {
  //         id: e.payload.doc.id,
  //         link: e.payload.doc.data()['link'],
  //         sub: e.payload.doc.data()['sub'],
  //         head: e.payload.doc.data()['head'],
  //         des: e.payload.doc.data()['des'],
  //         time: e.payload.doc.data()['time']
  //       };
  //     });
  //   });
  // }

  getLessons() {
    let sub: Subscription = this.firestore.collection<any>('courses').doc('Financial Planning Basics').valueChanges().subscribe((data) => {
      console.log(data)
      console.log(data["lessons"])
      
      this.picture = data["picture"]
      this.title = data["title"]
      for (let each of data["lessons"]) {
        each["link"] = this.sanitizer.bypassSecurityTrustResourceUrl(each["link"]);
      }
      this.lessons = data["lessons"]
      console.log(this.lessons)

      // this.items.map(el => el.link = this.sanitizer.bypassSecurityTrustResourceUrl(el.link));
      sub.unsubscribe()
    })
  }

  getCourses(id) {
    // return this.firestore.collection('courses').doc(id).valueChanges()
    return this.firestore.collection('courses').doc(id).snapshotChanges();

  }

}
