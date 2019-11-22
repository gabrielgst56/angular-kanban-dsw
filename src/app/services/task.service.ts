import { Injectable } from '@angular/core';
import { Task } from './../models/task.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
 constructor(private http: HttpClient) { }

    baseurl: string = "http://localhost:4200/api/";
  
    getAllTasks(){
      return this.http.get<Task[]>(this.baseurl + 'task').subscribe((result) => console.log(result));
    }
  
    getTaskById(id: string){
      return this.http.get<Task>(this.baseurl + 'task' + '/' + id);
    }
  
    addTask(task: Task){
      console.log(task);
      return this.http.post(this.baseurl + 'task', task).subscribe((result) => console.log(result));
    }
  
    deleteTask(id: string){
      return this.http.delete(this.baseurl + 'task' + '/' + id);
    }
  
    updateTask(task: Task){
      return this.http.put(this.baseurl + 'task' + '/' + task.id, task);
    }
}
