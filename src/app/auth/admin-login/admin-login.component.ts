import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AuthService } from '../auth.service';
import { StolperSteineUser } from '../../models/stolper-steine-user';

@Component({
    selector: 'app-admin-login',
    imports: [MatFormFieldModule, MatButtonModule, MatInput, ReactiveFormsModule],
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit {
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
            email: new FormControl('jackoschoonderwoerd@gmail.com'),
            password: new FormControl('123456')
        })
    }
    onSubmit() {
        console.log(this.form.value)
        const stolperSteinUser: StolperSteineUser = this.form.value
        this.authService.loginWithEmailAndPassword(stolperSteinUser)
    }
}
