import { Component, OnInit, NgModule } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from 'src/app/models/board.model';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})

export class MainViewComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private taskService: TaskService) { }

  board: Board = null;
  isEditar: boolean = false;
  addForm: FormGroup;
  editForm: FormGroup;
  actualEditTask: Task;

  ngOnInit() {
    this.board = new Board([
      new Column('A se fazer', true, []),
      new Column('Em andamento', false, []),
      new Column('Completo', false, [])
    ]);

    this.addForm = this.formBuilder.group({
      nameAdd: ['', Validators.required],
      percentAdd: ['', Validators.required]
    });
    
    this.editForm = this.formBuilder.group({
      nameEdit: ['', Validators.required],
      percentEdit: ['', Validators.required]
    });

    this.taskService.getAllTasks();
  }

  get f() { return this.addForm.controls; }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  public addTask() {

    let percent = this.addForm.value.percentAdd;
    let name = this.addForm.value.nameAdd;

    if(name == ""){
      alert("Descrição vazia.");
      return;
    }

    if(percent == 0){
      this.board.columns[0].tasks.push(new Task(null, name, percent));
    }
    else if(percent > 0 && percent < 100){
      this.board.columns[1].tasks.push(new Task(null, name, percent));
    }
    else if(percent == 100){
      this.board.columns[2].tasks.push(new Task(null, name, percent));
    }
    else{
      alert("Porcentagem inválida.");
      return;
    }

    this.taskService.addTask(new Task(null, name, percent));
    
    this.addForm.setValue({
      nameAdd : "",
      percentAdd : ""
    });
  }

  
  public editTask() {

    let percent = this.editForm.value.percentEdit;
    let name = this.editForm.value.nameEdit;
    let edited = false;

    if(name == ""){
      alert("Descrição vazia.");
      return;
    }

    if(percent == 0){
      this.board.columns[0].tasks.push(new Task(null, name, percent));
      edited = true;
    }
    else if(percent > 0 && percent < 100){
      this.board.columns[1].tasks.push(new Task(null, name, percent));
      edited = true;
    }
    else if(percent == 100){
      this.board.columns[2].tasks.push(new Task(null, name, percent));
      edited = true;
    }
    else{
      alert("Porcentagem inválida.");
      return;
    }

    if(edited){
      this.board.columns[0].tasks = this.board.columns[0].tasks.filter(task => task.name !== this.actualEditTask.name);
      this.board.columns[1].tasks = this.board.columns[1].tasks.filter(task => task.name !== this.actualEditTask.name);
      this.board.columns[2].tasks = this.board.columns[2].tasks.filter(task => task.name !== this.actualEditTask.name);

      this.actualEditTask = null;
      this.isEditar = false;
    }

  }

  public setEditTask(model: Task) {
    console.log(model);

    this.isEditar = true;
    
    this.editForm.setValue({
      nameEdit : model.name,
      percentEdit : model.percentage
    });

    this.actualEditTask = model;
  }


}
