import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, map, Observable } from "rxjs";
import { Menu } from "src/app/model/menu";
import { MenuService } from "src/app/service/menu.service";
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
    menuList$: BehaviorSubject<Menu[]>;

    constructor(private angularFireAuth: AngularFireAuth,
        private spinnerService: SpinnerService,
        private toastService: ToastService,
        private router: Router,
        menuService: MenuService) {
        this.username$ = angularFireAuth.user.pipe(map(user => user?.displayName || user?.email));
        this.menuList$ = menuService.menuList$;
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
