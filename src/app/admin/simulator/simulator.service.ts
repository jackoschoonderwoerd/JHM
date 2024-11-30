import { Injectable } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { StolperStein } from '../../models/stolper-stein.model';
import { FindNearestStopleSteineService } from '../../services/find-nearest-stolper-steine.service';

@Injectable({
    providedIn: 'root'
})
export class SimulatorService {

    constructor(
        private fs: FirestoreService,
        private findNearestStopleSteineService: FindNearestStopleSteineService
    ) { }

    getDistanceBetweenAllStonesAndAGivenLocation(userLatitude, userLongitude) {
        const path = 'stolper-steine';
        this.fs.collection(path).subscribe((steine: StolperStein[]) => {
            console.log(steine)
            steine.forEach((stein: StolperStein) => {
                console.log(stein.firstName, stein.lastName)
                // this.findNearestStopleSteineService.distanceFromObject(
                //     stein.latitude,
                //     stein.longitude,
                //     userLatitude,
                //     userLongitude
                // )
            })
        })
    }
}
