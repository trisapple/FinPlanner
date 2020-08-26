import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { TodoListService } from 'src/app/todo-list.service';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {

  name: String

  constructor(public navCtrl: NavController, public firestore: AngularFirestore, public todolistService: TodoListService) { }

  ngOnInit() {
  }

  addTodo() {
    var reminder = {}
    console.log(this.todolistService.todoList)
    reminder["name"] = this.name
    reminder["dueDate"] = new Date()
    console.log(reminder["dueDate"])
    console.log(reminder)
    this.todolistService.todoList.push(reminder)
    console.log(this.name)
    this.firestore.collection<any>('users').doc("1802328C@student.tp.edu.sg").update({todolist: this.todolistService.todoList})
    this.todolistService.getTodo()
    this.navCtrl.pop()
  }

}
