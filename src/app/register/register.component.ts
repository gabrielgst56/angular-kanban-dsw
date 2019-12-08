import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from './../models/user';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    isExistEmail: boolean;
    submitted: boolean;
    form: FormGroup;

    constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get f() { return this.form.controls; }

    onSubmit(email: string, password: string) {
        this.authService.verifyUser(email).subscribe((result) => {
            if (!result[0]) {
                this.authService.register(email, password).subscribe((result) => {
                    if (result) {
                        this.router.navigate(['']);
                    } else{
                        alert("Email inválido e/ou senha precisa ter no mínimo 6 caracteres.");
                    }
                });
            }else{
                alert("Email já cadastrado.");
            }
        });

    }

}
