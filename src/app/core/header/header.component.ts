import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { map, Observable } from "rxjs";
import { SpinnerService } from "../spinner/spinner.service";
import { ToastService } from "../toast/toast.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

    faRightFromBracket = faRightFromBracket;
    username$: Observable<string | null | undefined>;

    menuList = [
        { title: 'Dashboard', path: '' },
        { title: 'Accounting', path: 'accounting' },
        { title: 'Condo', path: 'condo' },
        { title: 'Home', path: 'home' }
    ];

    constructor(private angularFireAuth: AngularFireAuth,
            private spinnerService: SpinnerService,
            private toastService: ToastService,
            private router: Router) {
                this.username$ = angularFireAuth.user.pipe(map(user => user?.displayName || user?.email));
        }

    logout(): void {
        this.spinnerService.show();
        this.angularFireAuth.signOut()
            .then(_ => this.logoutSuccess())
            .finally(() => this.spinnerService.hide());
    }

    logoutSuccess(): void {
        this.toastService.showSuccess('Goodbye!');
        this.router.navigate(['login']);
    }

}
