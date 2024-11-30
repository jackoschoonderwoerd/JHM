import { inject, Injectable } from '@angular/core';
import { StolperSteineUser } from '../models/stolper-steine-user';
import {
    getAuth,
    Auth,
    AuthError,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    user,
    UserCredential,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signOut
} from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';
import { User as FirebaseUser } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isLoggedIn: boolean = false;

    constructor(
        private auth: Auth,
        private router: Router
    ) { }

    loginWithEmailAndPassword(stolperSteineUser: StolperSteineUser) {
        return signInWithEmailAndPassword(this.auth, stolperSteineUser.email, stolperSteineUser.password)
            .then((res: any) => {
                console.log(res);
                this.isLoggedIn = true;
                this.router.navigateByUrl(`manage-stones`)
            })
            .catch((err: FirebaseError) => {
                console.log(err);
            })
    }
    logOut() {
        this.auth.signOut();
        this.isLoggedIn = false;
    }
    persistLogin(user: FirebaseUser) {
        if (user) {
            this.isLoggedIn = true;
        } else {
            this.isLoggedIn = false;
        }
    }
}
