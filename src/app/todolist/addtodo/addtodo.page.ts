import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { TodoListService } from 'src/app/todo-list.service';
import { UserService } from 'src/app/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addtodo',
  templateUrl: './addtodo.page.html',
  styleUrls: ['./addtodo.page.scss'],
})
export class AddtodoPage implements OnInit {

  name: String
  date: Date
  // time: Time

  constructor(public navCtrl: NavController, public firestore: AngularFirestore, public todolistService: TodoListService, public toastCtrl: ToastController, public userService: UserService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      this.name = this.router.getCurrentNavigation().extras.state.remindername;
      this.date = this.router.getCurrentNavigation().extras.state.reminderdate;
    }
  }

  addTodo() {
    if (this.name == undefined || this.name == "" || this.date == undefined) {
      this.presentToast('Please enter a reminder name and date to be reminded', 'middle', 2000);
    } else {
      var todo = {} // Temporary New todo Object
      todo["name"] = this.name // Set the name of the New todo Object
      todo["dueDate"] = new Date(this.date) // Set the date of the New todo Object.
      todo["checked"] = false
      this.todolistService.localtodoList.push(todo) // Add the newly added todo to the todoList array

      console.log(this.todolistService.firetodoList)
      console.log(this.todolistService.localtodoList)

      // For logging
      console.log(todo["dueDate"])
      console.log(todo)
      console.log(this.name)
      console.log(this.date)
      // console.log(this.time)

      // Update the user's todoList with the newly added todo added to the todoList array
      this.firestore.collection<any>('users').doc(this.userService.uid).update({
        todolist: this.todolistService.localtodoList
      })
        // After it is updated, refresh the todolist and go back.
        .then(value => {
          this.todolistService.getTodo()
          this.presentToast('To-do Added!', 'middle', 2000);
          this.navCtrl.pop()
        })
        // Log and catch the error
        .catch(value => {
          console.log(value)
        })
    }

  }

  async presentToast(message, position, duration) {
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
    });
    toast.present();
  }

}
