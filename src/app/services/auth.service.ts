import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from './../models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user: User;
    isAuthenticated: boolean;

    baseurl: string = "http://localhost:4200/api/";
    
    constructor(private http: HttpClient, private router: Router) { }

    login(email:string, password:string): Observable<boolean>{
        let res = this.http.post<boolean>(this.baseurl + 'login', new User(null ,email, password));
        res.subscribe((result) => {
            if (result[0] != null){
                this.user = new User(result[0]["ID"], result[0]["email"], result[0]["password"]);
                this.isAuthenticated = true;
            } 
        });
        return res;
    }
    
    register(email:string, password:string): Observable<boolean>{
       return this.http.post<boolean>(this.baseurl + 'register', new User(null, email, password));
    }

    sendEmail(email:string, task:string){
       this.http.post<boolean>(this.baseurl + 'sendEmail', {'email' : email, 'task' : task}).subscribe((result) => {});
    }

    verifyUser(email:string):Observable<boolean>{
        return this.http.post<boolean>(this.baseurl + 'verifyUser', {'email' : email});
     }
}
