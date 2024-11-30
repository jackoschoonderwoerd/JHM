import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { StolperStein } from '../models/stolper-stein.model';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    stones: StolperStein[] = []

    constructor(
        private fs: FirestoreService
    ) { }

    getSortedStones(userCoords: GeolocationCoordinates) {


        const stonesWithDistanceFromUser: StolperStein[] = []
        return this.getStones()
            .then((stones: StolperStein[]) => {
                return this.addDistanceToStones(stones, userCoords)
            })
            .then((stonesWithDistance: StolperStein[]) => {
                return this.sortStonesByDistance(stonesWithDistance)
            })
    }

    private addDistanceToStones(stones: StolperStein[], userCoords: GeolocationCoordinates) {

        const stonesWithDistanceFromUser: StolperStein[] = [];
        const promise = new Promise((resolve, reject) => {

            stones.forEach((stone: StolperStein) => {
                this.distanceFromObject(
                    stone.latitude,
                    stone.longitude,
                    userCoords.latitude,
                    userCoords.longitude)
                    .then((distanceInMeters: number) => {
                        stone.distanceFromUserInMeters = distanceInMeters;

                        stonesWithDistanceFromUser.push(stone)
                        resolve(stonesWithDistanceFromUser)
                    })
            })
        })
        return promise
    }

    private sortStonesByDistance(stonesWithDistance: StolperStein[]) {
        const promise = new Promise((resolve, reject) => {

            stonesWithDistance = stonesWithDistance.sort((a, b) => a.distanceFromUserInMeters - b.distanceFromUserInMeters);
            // stonesWithDistance.forEach((stone: StolperStein) => {
            //     console.log(stone.distanceFromUserInMeters)
            // })
            resolve(stonesWithDistance)
        })
        return promise
    }


    private getStones() {
        const path = `stolper-steine`
        const promise = new Promise((resolve, reject) => {
            this.fs.collection(path).subscribe((stones: StolperStein[]) => {
                if (stones) {
                    resolve(stones)
                } else {
                    reject();
                }
            })
        })
        return promise
    }

    private distanceFromObject(latObject: number, lonObject: number, latVisitor: number, lonVisitor: number) {// generally used geo measurement function
        const promise = new Promise((resolve, reject) => {
            var R = 6378.137; // Radius of earth in KM
            var dLat = latVisitor * Math.PI / 180 - latObject * Math.PI / 180;
            var dLon = lonVisitor * Math.PI / 180 - lonObject * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(latObject * Math.PI / 180) * Math.cos(latVisitor * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            // console.log(Math.round(d * 1000))
            resolve(Math.round(d * 1000)); // meters
        })
        return promise
    }
}
