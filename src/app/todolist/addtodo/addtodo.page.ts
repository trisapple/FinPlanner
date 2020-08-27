import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { TodoListService } from 'src/app/todo-list.service';
import { Time } from '@angular/common';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {

  name: String
  date: Date
  time: Time

  constructor(public navCtrl: NavController, public firestore: AngularFirestore, public todolistService: TodoListService) { 

  }

  ngOnInit() {
  }

  public addTodo() {
    var reminder = {}
    console.log(this.todolistService.todoList)
    reminder["name"] = this.name
    reminder["dueDate"] = new Date()
    console.log(reminder["dueDate"])
    console.log(reminder)
    this.todolistService.todoList.push(reminder)
    console.log(this.name)
    console.log(this.date)
    console.log(this.time)
    this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").update({
      todolist: this.todolistService.todoList
    })
    .then(value => {
      console.log("then function run")
      this.todolistService.getTodo()
      this.navCtrl.pop()
    })
    .catch(value => {
      console.log(value)
    })
  }

}
