import { Injectable } from '@angular/core';
import { Task } from './../models/task.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
 
    baseurl: string = "http://localhost:4200/api/";

    constructor(private http: HttpClient) { }
  
    getAllTasks(){
      return this.http.get<Task[]>(this.baseurl + 'task').subscribe((result) => console.log(result));
    }
  
    getTaskByUserId(id: number): Observable<Task[]>{
      return this.http.get<Task[]>(this.baseurl + 'task' + '/' + id);
    }
  
    addTask(task: Task){
      return this.http.post(this.baseurl + 'task', task).subscribe((result) => console.log(result));
    }
  
    deleteTask(id: number){
      return this.http.delete(this.baseurl + 'task' + '/' + id).subscribe((result) => console.log(result));
    }
  
    updateTask(task: Task){
      return this.http.patch(this.baseurl + 'task' + '/' + task.ID, task).subscribe((result) => console.log(result));
    }
}
