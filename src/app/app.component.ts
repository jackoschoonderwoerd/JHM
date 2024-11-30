// https://www.google.com/maps/d/viewer?mid=1Is_fKT4eYKHOZ_HSDW3CA7i2IfW7RJLN&femb=1&ll=52.36813394538972%2C4.905858198281159&z=18

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header/header.component';
import { Auth, onAuthStateChanged, User as FirebaseUser } from '@angular/fire/auth';
import { AuthService } from './auth/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, MatSidenavModule, SidenavComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'stolper-steine';

    constructor(
        private auth: Auth,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        onAuthStateChanged(this.auth, (user: FirebaseUser | null) => {
            if (user) {
                this.authService.persistLogin(user);
            }
        })
    }
}
