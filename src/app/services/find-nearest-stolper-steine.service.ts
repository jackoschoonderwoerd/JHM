import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { StolperStein } from '../models/stolper-stein.model';

@Injectable({
    providedIn: 'root'
})
export class FindNearestStopleSteineService {

    constructor(
        private router: Router,
        private fs: FirestoreService
    ) { }

    getStoneLonLatId() {
        const path = 'stonesGeoLocation'

        // this.fs.collection()
    }
    findNearest() {
        const path = 'stolper-steine'
        this.fs.collection(path).pipe(take(1)).subscribe((stolperSteine: StolperStein[]) => {

            console.log(stolperSteine)
            stolperSteine.forEach((stolperStein: StolperStein) => {
                this.getDistanceFromUser(stolperStein.latitude, stolperStein.longitude)
                    .subscribe((metersFromUser: number) => {
                        console.log(
                            {
                                metersFromUser,
                                stolperStein
                            }
                        )
                    })
            })
        })
    }

    private getDistanceFromUser(itemLatitude: number, itemLongitude: number) {
        // console.log('getDistanceFromUser(){}')
        if (!navigator) {
            this.router.navigate(['/user/user-error-page', { message: 'no navigator' }])
        } else {
            const distanceToObject = new Observable(observer => {
                navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                    if (!position) {
                        this.router.navigate(['/user/user-error-page', { message: 'can\'t determinate users geolocation' }])
                    } else {
                        const userLat = position.coords.latitude;
                        const userLon = position.coords.longitude;
                        const distanceFromObject = this.distanceFromObject(userLat, userLon, itemLatitude, itemLongitude);
                        observer.next(distanceFromObject);
                        observer.complete();
                    }
                })
            })
            return distanceToObject
        }
    }

    distanceFromObject(latObject: number, lonObject: number, latVisitor: number, lonVisitor: number) {// generally used geo measurement function
        var R = 6378.137; // Radius of earth in KM
        var dLat = latVisitor * Math.PI / 180 - latObject * Math.PI / 180;
        var dLon = lonVisitor * Math.PI / 180 - lonObject * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(latObject * Math.PI / 180) * Math.cos(latVisitor * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        console.log(Math.round(d * 1000))
        return Math.round(d * 1000); // meters
    }
}
