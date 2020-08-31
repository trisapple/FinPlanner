import { Component, OnInit } from '@angular/core';
import { TodoListService } from 'src/app/todo-list.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-updatetodo',
  templateUrl: './updatetodo.page.html',
  styleUrls: ['./updatetodo.page.scss'],
})
export class UpdatetodoPage implements OnInit {

  constructor(public todolistService: TodoListService, public firestore: AngularFirestore, public navCtrl: NavController, public userService: UserService) {
    console.log(todolistService.name)
    console.log(todolistService.date)
    console.log(todolistService.index)
  }

  ngOnInit() {
  }

  updateTodo() {
    var todo = {} // Temporary New todo Object
    console.log(this.todolistService.todoList)
    todo["name"] = this.todolistService.name // Set the name of the New todo Object
    todo["dueDate"] = new Date(this.todolistService.date) // Set the date of the New todo Object.
    todo["checked"] = this.todolistService.checked
    this.todolistService.todoList[this.todolistService.index] = todo // Update the properties of the todo

    // Update the user's todoList with the newly added todo added to the todoList array
    this.firestore.collection<any>('users').doc(this.userService.uid).update({
      todolist: this.todolistService.todoList
    })
      // After it is updated, refresh the todolist and go back.
      .then(value => {
        this.todolistService.getTodo()
        this.navCtrl.pop()
      })
      // Log and catch the error
      .catch(value => {
        console.log(value)
      })
  }

}
