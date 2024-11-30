import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SimulationLocation } from '../../models/simulation-location';
import { FirestoreService } from '../../services/firestore.service';
import { DocumentReference } from '@angular/fire/firestore';
import { FirebaseError } from '@angular/fire/app';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../ui/confirm-dialog/confirm-dialog.component';
import { FindNearestStopleSteineService } from '../../services/find-nearest-stolper-steine.service';
import { SimulatorService } from './simulator.service';
import { LocationService } from '../../services/location.service';
import { StolperStein } from '../../models/stolper-stein.model';
import { DatePipe, JsonPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-simulator',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInput,
        MatButtonModule,
        MatRadioModule,
        FormsModule,
        MatIconModule,
        DatePipe,
        MatExpansionModule
    ],
    templateUrl: './simulator.component.html',
    styleUrl: './simulator.component.scss'
})
export class SimulatorComponent implements OnInit {
    form: FormGroup;
    simulationLocations: SimulationLocation[] = [];
    selectedLocation: SimulationLocation;
    editmode: boolean = false;
    sortedStones: StolperStein[] = [];

    constructor(
        private fb: FormBuilder,
        private fs: FirestoreService,
        private dialog: MatDialog,
        private findNearestService: FindNearestStopleSteineService,
        private simulatorService: SimulatorService,
        private locationService: | LocationService
    ) { }

    ngOnInit(): void {
        this.initForm()
        this.loadSimulationLocationsArray();

    }
    initForm() {
        this.form = this.fb.group({
            id: new FormControl(null),
            description: new FormControl(null, [Validators.required]),
            latitude: new FormControl(null, [Validators.required]),
            longitude: new FormControl(null, [Validators.required])
        })
    }
    onSubmit() {
        console.log(this.form.value)
        const simulationLocation: SimulationLocation = this.form.value;
        if (!this.editmode) {
            const path = 'simulation-location'
            this.fs.addDoc(path, simulationLocation)
                .then((docRef: DocumentReference) => {
                    console.log(docRef.id)
                    this.form.reset()

                })
                .catch((err: FirebaseError) => {
                    console.log(err.message)
                })
        } else {
            const path = `simulation-location/${simulationLocation.id}`
            console.log(path)
            this.fs.setDoc(path, simulationLocation)
                .then((res: any) => {
                    console.log(res);
                    this.form.reset();
                    this.editmode = false;
                })
                .catch((err: FirebaseError) => {
                    console.log(err.message)
                })
        }
    }
    loadSimulationLocationsArray() {
        const path = 'simulation-location'
        this.fs.collection(path).subscribe((simulationLocations: SimulationLocation[]) => {
            this.simulationLocations = simulationLocations;
        })
    }

    onEdit(location: SimulationLocation) {
        this.editmode = true;
        console.log(location)
        this.form.patchValue({
            ...location
        })
    }

    onDelete(id: string) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                message: id
            }
        })
        dialogRef.afterClosed().subscribe((res: boolean) => {
            if (res) {
                const path = `simulation-location/${id}`
                this.fs.deleteDoc(path)
                    .then((res: any) => {
                        console.log(res)
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err.message)
                    })
            }
        })
    }
    onRadioButton(location: SimulationLocation) {
        const geolocationCoordinates: GeolocationCoordinates = {
            accuracy: null,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            latitude: location.latitude,
            longitude: location.longitude,
            speed: null,
            toJSON: null
        }
        this.locationService.getSortedStones(geolocationCoordinates)
            .then((sortedStones: StolperStein[]) => {
                sortedStones.forEach((stone: StolperStein) => {
                    console.log(stone.lastName, stone.distanceFromUserInMeters)
                })
                this.sortedStones = sortedStones;
            })

    }
    onCancel() {
        this.editmode = false;
        this.form.reset()
    }
}
