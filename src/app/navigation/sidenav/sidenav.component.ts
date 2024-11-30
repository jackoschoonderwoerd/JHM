import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-sidenav',
    imports: [MatListModule, MatIconModule, RouterModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

    @Output() closeSidenav = new EventEmitter<void>

    constructor(public authService: AuthService) { }

    onCloseSidenav() {
        this.closeSidenav.emit()
    }
    onSignOut() {
        this.onCloseSidenav();
        this.authService.logOut();
    }
}
