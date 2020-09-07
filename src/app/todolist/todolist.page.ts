import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { TodoListService } from '../todo-list.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  constructor(public navCtrl: NavController, public todolistService: TodoListService, public firestore: AngularFirestore, public userService: UserService, public alertController: AlertController) {
    
  }

  ngOnInit() {
    if (this.userService.loggedin) {
      this.todolistService.getTodo()
    }
  }

  addTodo() {
    this.navCtrl.navigateForward(['/todolist/add']);
  }

  todocheck(each, i) {
    this.todolistService.firetodoList[i]["checked"] = each.checked // Check or uncheck the todo
    this.todolistService.localtodoList[i]["checked"] = each.checked
    
    // Update the user's todoList with the newly checked or unchecked todo
    this.firestore.collection<any>('users').doc(this.userService.uid).update({
      todolist: this.todolistService.firetodoList
    })
  }

  updateTodo(each, i) {
    // Put the reminder properties into global variables which will be accessed by the update todo page
    this.todolistService.name = each.name
    this.todolistService.date = each.dueDate.toDate().toISOString()
    this.todolistService.checked = each.checked
    this.todolistService.index = i // Position of todo in todolistService.todoList array
    this.navCtrl.navigateForward(['/todolist/update']);
  }

  async deleteTodo(index) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      header: 'Delete To-do?',
      message: 'Are you sure you want to delete the to-do?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          // cssClass: 'secondary',
          handler: () => {
            console.log('Cancelled');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.todolistService.localtodoList.splice(index, 1)

            // Update the user's todoList with the newly added todo added to the todoList array
            this.firestore.collection<any>('users').doc(this.userService.uid).update({
              todolist: this.todolistService.localtodoList
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
      ]
    });

    await alert.present();
  }
}
