import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StolperSteineUser } from '../../models/stolper-steine-user';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    form: FormGroup

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.initForm()
    }

    initForm() {
        this.form = this.fb.group({
            email: new FormControl('jackoboes@gmail.com', [Validators.required]),
            password: new FormControl('123456', [Validators.required])
        })

    }
    onSubmit() {
        const formValue = this.form.value;
        const stolperSteineUser: StolperSteineUser = {
            email: formValue.email,
            password: formValue.password
        }
        this.authService.loginWithEmailAndPassword(stolperSteineUser)

    }
}

