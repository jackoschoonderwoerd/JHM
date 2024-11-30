import { Component, EventEmitter, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-header',
    imports: [MatToolbarModule, RouterModule, MatIconModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {

    @Output() sidenavToggle = new EventEmitter<void>
    constructor(public authService: AuthService) { }

    signOut() {
        this.authService.logOut()
    }

    onMenu() {
        this.sidenavToggle.emit()
    }
}
