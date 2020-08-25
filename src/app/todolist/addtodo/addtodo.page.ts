import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }

  addTodo() {
    this.navCtrl.pop()
  }

}
