import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { User } from '../models/user';
import { AuthService } from '../services/auth.service'; // Serviço de autenticação

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    //isCompleted: boolean;
   // submitted: boolean;

    private users: Array<User> = [];

    constructor(public authService: AuthService, public router: Router) { }

    ngOnInit() {
    }

    onSubmit(email: string, password: string) {

       // this.submitted = true;
       // this.isCompleted = true;

        let result = this.authService.login(email, password).subscribe((result) => {
            if (result[0] != null){
                this.router.navigate(['/kanban']);
            } else {
                alert('usuário e/ou senha inválido(s)');
            }
        });

    }

    register() {
        this.router.navigate(['/register']);
    }
    
}
