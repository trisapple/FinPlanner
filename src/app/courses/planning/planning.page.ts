import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../courses.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-planning',
  templateUrl: './planning.page.html',
  styleUrls: ['./planning.page.scss'],
})

export class PlanningPage implements OnInit {

  data: any;
  // doc: any;
  // lessons: { id: string; link: string; sub: string; head: string; des: string; time: string; } [];
  // addlesson: {link: string; sub: string; head: string; des: string; time: string};
  object: any;
  constructor(public coursesService: CoursesService, public firestore: AngularFirestore, private sanitizer: DomSanitizer,
      private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.title;
    
        
       console.log( this.coursesService.getCourses(this.data))
      }
    })
  }

  ngOnInit() {
    // this.data = this.firestore.collection('/courses/' + this.data).snapshotChanges().subscribe(res => {
    //   if(res){
    //     this.lessons = res.map(e => {
    //       return{
    //         id: e.payload.doc.id,
    //         link: e.payload.doc.data()['link'],
    //         sub: e.payload.doc.data()['sub'],
    //         head: e.payload.doc.data()['head'],
    //         des: e.payload.doc.data()['des'],
    //         time: e.payload.doc.data()['time']

    //       };
    //     });
    //   }
    // });

    console.log(this.data);
       // this.items.map(el => el.vid = this.sanitizer.bypassSecurityTrustResourceUrl(el.vid));
    // console.log(this.items);
  }


}
