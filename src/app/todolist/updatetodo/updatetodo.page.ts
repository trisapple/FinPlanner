import { Component, OnInit } from '@angular/core';
import { TodoListService } from 'src/app/todo-list.service';

@Component({
  selector: 'app-updatetodo',
  templateUrl: './updatetodo.page.html',
  styleUrls: ['./updatetodo.page.scss'],
})
export class UpdatetodoPage implements OnInit {

  // name: String
  // date: String

  constructor(public todolistService: TodoListService) { 
    // this.name = this.activatedRoute.snapshot.paramMap.get('name')
    console.log(todolistService.name)
    console.log(todolistService.date)
    // this.date = this.activatedRoute.snapshot.paramMap.get('date')
  }

  ngOnInit() {
  }

  updateTodo(){

  }

}
