import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';

import { StoneGeoLocation } from '../../models/stone-geo-location.model';
import { FirestoreService } from '../../services/firestore.service';
import { FirebaseError } from '@angular/fire/app';
import { MatIconModule } from '@angular/material/icon';
import { DocumentReference } from '@angular/fire/firestore';
import { StolperStein } from '../../models/stolper-stein.model';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-add-stone',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInput,
        MatButtonModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './add-stone.component.html',
    styleUrl: './add-stone.component.scss'
})
export class AddStoneComponent implements OnInit {

    form: FormGroup;
    stolperStein: StolperStein;
    editmode: boolean = false

    constructor(
        private fb: FormBuilder,
        private fs: FirestoreService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm()
        const id = this.route.snapshot.paramMap.get('id')
        console.log(id)
        if (id) {
            this.editmode = true;
            const path = `stolper-steine/${id}`
            this.fs.getDoc(path).subscribe((stolperStein: StolperStein) => {
                this.patchForm(stolperStein)
                // console.log(stolperStein.dateOfDeath.seconds)
                // console.log(new Date(stolperStein.dateOfDeath.seconds * 1000))
                // // console.log(new Date{stolperStein})
                // this.form.patchValue({
                //     dateOfDeath: new Date(stolperStein.dateOfDeath.seconds * 1000),
                // })

                // this.form.setValue({ ...stolperStein })

            })
        }
    }

    initForm() {
        this.form = this.fb.group({
            id: new FormControl(null),
            firstName: new FormControl(null, [Validators.required]),
            preposition: new FormControl(null),
            lastName: new FormControl(null, [Validators.required]),
            street: new FormControl(null),
            houseNumber: new FormControl(null),
            city: new FormControl(null),
            birthyear: new FormControl(null),
            dateOfDeath: new FormControl(null),
            location: new FormControl(null),
            dateOfStolperSteinLaying: new FormControl(null),
            weblink: new FormControl(null),
            latitude: new FormControl(null, [Validators.required]),
            longitude: new FormControl(null, [Validators.required]),

        });
    }

    onSubmit() {
        const stolperStein: StolperStein = this.form.value;
        console.log(stolperStein)
        if (!this.editmode) {
            this.addStone(stolperStein)
        } else {
            this.updateStone(stolperStein)
        }

    }
    addStone(stolperStein: StolperStein) {
        const path = `stolper-steine`
        this.fs.addDoc(path, stolperStein)
            .then((docRef: DocumentReference) => {
                console.log(docRef.id)
                this.form.reset();
                this.router.navigateByUrl('manage-stones')
            })
            .catch((err: FirebaseError) => {
                console.log(err.message)
            })

    }
    updateStone(stolperStein: StolperStein) {
        const path = `stolper-steine/${stolperStein.id}`
        this.fs.setDoc(path, stolperStein)
            .then((res: any) => {
                console.log(res)
                this.form.reset();
                this.router.navigateByUrl('manage-stones')
            })
            .catch((err: FirebaseError) => {
                console.log(err.message)
            })
    }
    onCancel() {
        this.form.reset()
        this.router.navigateByUrl('manage-stones')
    }

    private patchForm(stolperStein: StolperStein) {
        this.form.patchValue({
            id: stolperStein.id ? stolperStein.id : null,
            firstName: stolperStein.firstName ? stolperStein.firstName : null,
            preposition: stolperStein.preposition ? stolperStein.preposition : null,
            lastName: stolperStein.lastName ? stolperStein.lastName : null,
            street: stolperStein.street ? stolperStein.street : null,
            houseNumber: stolperStein.houseNumber ? stolperStein.houseNumber : null,
            city: stolperStein.city ? stolperStein.city : null,
            birthyear: stolperStein.birthyear ? stolperStein.birthyear : null,
            dateOfDeath: stolperStein.dateOfDeath ? new Date(stolperStein.dateOfDeath.seconds * 1000) : null,
            location: stolperStein.location ? stolperStein.location : null,
            dateOfStolperSteinLaying: stolperStein.dateOfStolperSteinLaying ? new Date(stolperStein.dateOfStolperSteinLaying.seconds * 1000) : null,
            weblink: stolperStein.weblink ? stolperStein.weblink : null,
            latitude: stolperStein.latitude ? stolperStein.latitude : null,
            longitude: stolperStein.longitude ? stolperStein.longitude : null,

            // dateOfStolperSteinLaying: new Date(stolperStein.dateOfStolperSteinLaying.seconds * 1000)
        })
    }
}
