import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TodoListService } from '../todo-list.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  constructor(public navCtrl: NavController, public todolistService: TodoListService) {
    this.todolistService.getTodo()
  }

  ngOnInit() {
  }

  addTodo() {
    this.navCtrl.navigateForward(['/todolist/add']);
  }

}
