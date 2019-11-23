import { User } from './../models/user';
import { Injectable } from '@angular/core';

import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user: User;
    isAuthenticated: boolean;

    baseurl: string = "http://localhost:4200/api/";
    
    login(login:string, password:string) : boolean{

        this.isAuthenticated = true;
        return true;
    }
    
    register(email:string, password:string) : boolean{
        return true;
    }
    
}
