import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

    faRightFromBracket = faRightFromBracket;

    constructor(private angularFireAuth: AngularFireAuth,
            private router: Router) {}

    logout(): void {
        this.angularFireAuth.signOut()
            .then(_ => this.router.navigate(['login']));
    }

}
