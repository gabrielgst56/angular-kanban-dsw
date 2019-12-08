import { User } from './../../models/user';
import { Component, OnInit, NgModule } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Board } from 'src/app/models/board.model';
import { FormGroup, FormBuilder, Validators } from '../../../../node_modules/@angular/forms';
import { Column } from 'src/app/models/column.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-view',
    templateUrl: './main-view.component.html',
    styleUrls: ['./main-view.component.scss']
})

export class MainViewComponent implements OnInit {

    constructor(private formBuilder: FormBuilder,
        private taskService: TaskService, private authService: AuthService,
        private router: Router) { }

    board: Board = null;
    isEditar: boolean = false;
    addForm: FormGroup;
    editForm: FormGroup;
    actualEditTask: Task;

    async ngOnInit() {
        if (!this.authService.isAuthenticated) {
            this.router.navigate(['/login']);
        }

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

        if (this.authService.user != null) {
            let result = this.taskService.getTaskByUserId(this.authService.user.ID).subscribe(result => {

                result.forEach(element => {

                    let task = new Task(element.ID, element.name, element.percentage, element.fk_User);

                    if (task.percentage == 0) {
                        this.board.columns[0].tasks.push(task);
                    }
                    else if (task.percentage > 0 && task.percentage < 100) {
                        this.board.columns[1].tasks.push(task);
                    }
                    else if (task.percentage == 100) {
                        this.board.columns[2].tasks.push(task);
                    }
                });
            });


        }
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
        let task = new Task(null, name, percent, this.authService.user.ID);

        if (name == "") {
            alert("Descrição vazia.");
            return;
        }

        if (percent == 0) {
            this.board.columns[0].tasks.push(task);
        }
        else if (percent > 0 && percent < 100) {
            this.board.columns[1].tasks.push(task);
        }
        else if (percent == 100) {
            this.authService.sendEmail(this.authService.user.email, name).subscribe((result) => {});
            this.board.columns[2].tasks.push(task);
        }
        else {
            alert("Porcentagem inválida.");
            return;
        }

        this.taskService.addTask(task);

        this.addForm.setValue({
            nameAdd: "",
            percentAdd: ""
        });
    }


    public editTask() {

        let percent = this.editForm.value.percentEdit;
        let name = this.editForm.value.nameEdit;
        let edited = false;

        if (name == "") {
            alert("Descrição vazia.");
            return;
        }

        let task = new Task(this.actualEditTask.ID, name, percent, this.authService.user.ID)

        this.board.columns[0].tasks = this.board.columns[0].tasks.filter(task => task.name !== this.actualEditTask.name);
        this.board.columns[1].tasks = this.board.columns[1].tasks.filter(task => task.name !== this.actualEditTask.name);
        this.board.columns[2].tasks = this.board.columns[2].tasks.filter(task => task.name !== this.actualEditTask.name);

        if (percent == 0) {
            this.board.columns[0].tasks.push(task);
        }
        else if (percent > 0 && percent < 100) {
            this.board.columns[1].tasks.push(task);
        }
        else if (percent == 100) {
            this.authService.sendEmail(this.authService.user.email, name).subscribe((result) => {});
            this.board.columns[2].tasks.push(task);
        }
        else {
            alert("Porcentagem inválida.");
            return;
        }

        this.taskService.updateTask(task);

        this.actualEditTask = null;
        this.isEditar = false;

    }

    public setEditTask(model: Task) {
        console.log(model);

        this.isEditar = true;

        this.editForm.setValue({
            nameEdit: model.name,
            percentEdit: model.percentage
        });

        this.actualEditTask = model;
    }


}
