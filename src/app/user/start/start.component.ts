import { Component, OnInit } from '@angular/core';
import { StolperStein } from '../../models/stolper-stein.model';
import { FirestoreService } from '../../services/firestore.service';
import { FindNearestStopleSteineService } from '../../services/find-nearest-stolper-steine.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserLocation } from '../../models/user-location';
import { LocationService } from '../../services/location.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthService } from '../../auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-start',
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatInput,
        MatExpansionModule,
        DatePipe,
        MatProgressSpinnerModule

    ],
    templateUrl: './start.component.html',
    styleUrl: './start.component.scss'
})
export class StartComponent implements OnInit {


    sortedStones: StolperStein[] = [];
    sortedStonesUnderMaximumMeters: StolperStein[] = [];
    allowedMaximumDistanceInMeters: number = 10000;
    fetchingData: boolean = false;
    private timeout?: number;

    constructor(
        private router: Router,
        private locationService: LocationService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.getStones()
    }

    getStones() {
        this.fetchingData = true
        this.getUserCoordinates().then((userGeoLocationPosition: GeolocationPosition) => {
            // console.log(userGeoLocationPosition.coords)
            const userCoords = userGeoLocationPosition.coords
            this.locationService.getSortedStones(userCoords).then((sortedStones: StolperStein[]) => {
                this.fetchingData = false
                this.sortedStonesUnderMaximumMeters = sortedStones.filter((stone: StolperStein) => {
                    return stone.distanceFromUserInMeters < this.allowedMaximumDistanceInMeters
                })
                console.log(this.sortedStonesUnderMaximumMeters);
            })
        })
    }

    private getUserCoordinates() {
        const promise = new Promise((resolve, reject) => {

            // console.log('start getUserCoordinates()')

            if (!navigator) {
                this.router.navigate(['/user/user-error-page', { message: 'no navigator' }])
            } else {
                // console.log('navigator found')
                navigator.geolocation.getCurrentPosition((geolocationPosition: GeolocationPosition) => {
                    // console.log(geolocationPosition)
                    if (!geolocationPosition) {
                        console.log('position not found')
                        this.router.navigate(['/user/user-error-page', { message: 'can\'t determinate users geolocation' }])
                    } else {

                        resolve(geolocationPosition)
                    }
                })
            }
        })
        return promise
    }
    distanceSelected(allowedMaximumDistanceInMeters: number): void {
        this.allowedMaximumDistanceInMeters = allowedMaximumDistanceInMeters;

        window.clearTimeout(this.timeout);

        this.timeout = window.setTimeout(() => this.getStones(), 300);
    }
}
