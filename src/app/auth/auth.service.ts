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
    signOut,
    User
} from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';
import { User as FirebaseUser } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    isLoggedIn: boolean = false;

    isAdmin: boolean = false;

    constructor(
        private auth: Auth,
        private router: Router
    ) { }

    loginWithEmailAndPassword(stolperSteineUser: StolperSteineUser) {
        return signInWithEmailAndPassword(this.auth, stolperSteineUser.email, stolperSteineUser.password)
            .then((userCredential: UserCredential) => {
                console.log(userCredential.user.uid);
                this.isLoggedIn = true;
                if (userCredential.user.uid === 'zt1VX1MJIGYmeTprAhZzkLVyMH73') {
                    this.isLoggedIn = true;
                    this.isAdmin = false;
                    this.router.navigateByUrl('start')
                } else if (userCredential.user.uid === 'kjvk8CxQcbP5kpblKbrJPmGdM0f2') {
                    this.isLoggedIn = true;
                    this.isAdmin = true;
                    this.router.navigateByUrl(`manage-stones`)

                }
                else {
                    this.isLoggedIn = false;
                    this.isAdmin = false;
                }
            })
            .catch((err: FirebaseError) => {
                this.isLoggedIn = false;
                this.isAdmin = false;
                console.log(err);
            })
    }

    // loginWithEmailAndPassword(stolperSteineUser: StolperSteineUser) {
    //     return signInWithEmailAndPassword(this.auth, stolperSteineUser.email, stolperSteineUser.password)
    //         .then((res: any) => {
    //             console.log(res);
    //             this.isLoggedIn = true;
    //             this.router.navigateByUrl(`manage-stones`)
    //         })
    //         .catch((err: FirebaseError) => {
    //             console.log(err);
    //         })
    // }



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
