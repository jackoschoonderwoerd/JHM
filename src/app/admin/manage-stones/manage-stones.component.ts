import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { StolperStein } from '../../models/stolper-stein.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
import { MatDialog } from '@angular/material/dialog'
import { ConfirmDialogComponent } from '../../ui/confirm-dialog/confirm-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
    selector: 'app-manage-stones',
    imports: [
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatFormFieldModule,
        MatInput,
        MatButtonModule
    ],
    templateUrl: './manage-stones.component.html',
    styleUrl: './manage-stones.component.scss'
})
export class ManageStonesComponent implements OnInit, AfterViewInit {

    // stolperSteine: StolperStein[] = [];
    displayedColumns: string[] = ['edit', 'firstName', 'preposition', 'lastName', 'street', 'houseNumber', 'city', 'weblink', 'delete'];
    dataSource = new MatTableDataSource<StolperStein>();

    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private fs: FirestoreService,
        private router: Router,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        const path = `stolper-steine`
        this.fs.collection(path).subscribe((stolperSteine: StolperStein[]) => {
            // this.stolperSteine = stolperSteine;
            this.dataSource.data = stolperSteine;
        })
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    onEdit(stolperSteinId: string) {
        console.log(stolperSteinId);
        this.router.navigate(['/add-stone', { id: stolperSteinId }])
    }
    onDelete(stolperStein: StolperStein
    ) {
        const dialogRef = this.dialog.open(
            ConfirmDialogComponent, {
            data: {
                message: stolperStein
            }
        }
        );
        dialogRef.afterClosed().subscribe((status: boolean) => {
            if (status) {
                const path = `stolper-steine/${stolperStein.id}`
                this.fs.deleteDoc(path)
                    .then((res: any) => {
                        console.log(res)
                    })
                    .catch((err: FirebaseError) => {
                        console.log(err)
                    })
            }
        })
    }
    onAddStone() {
        this.router.navigateByUrl('add-stone')
    }

    doFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
