import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  nextPage() {
    this.navCtrl.navigateForward(['/todolist/add']);
  }

}
