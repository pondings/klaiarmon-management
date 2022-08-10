import { ChangeDetectionStrategy, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, map, Observable, Subject, take } from "rxjs";
import { Menu, MenuConfig, MENU_LIST } from "src/app/model/menu";
import { SidebarService } from "./sidebar.service";
import { Offcanvas } from 'bootstrap';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import { EditProfileService } from "../edit-profile/edit-profile.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

    @ViewChild('offCanvas', { static: true })
    offCanvasElem: ElementRef | undefined;

    toggle$: Subject<void>;
    offCanvas: Offcanvas | undefined;
    menuList$: Observable<Menu[]>;
    profilePhoto: string | undefined | null = '';
    displayName: string | undefined | null = '';

    faPenToSquare = faPenToSquare;
    faRightFromBracket = faRightFromBracket;

    constructor(private renderer2: Renderer2,
        private angularFireAuth: AngularFireAuth,
        private router: Router,
        private editProfileService: EditProfileService,
        public sidebarService: SidebarService) {
        this.menuList$ = new BehaviorSubject<Menu[]>(MENU_LIST);
        this.toggle$ = sidebarService.toggle$;
    }

    async ngOnInit(): Promise<void> {
        this.offCanvas = new Offcanvas('#offCanvas');
        this.toggle$.subscribe(() => this.offCanvas?.toggle());

        this.offCanvasElem?.nativeElement?.addEventListener('show.bs.offcanvas', () => this.handleMenu());

        const currentUser = await this.angularFireAuth.currentUser;
        this.profilePhoto = currentUser?.photoURL;
        this.displayName = currentUser?.displayName;
    }

    editProfile(): void {
        this.editProfileService.editProfile();
    }

    logout(): void {
        this.angularFireAuth.signOut()
            .then(() => this.router.navigate(['login']));
    }

    handleMenu(): void {
        this.menuList$.pipe(take(1), map(menuList => this.getMenuListDropdownElement(menuList)))
            .subscribe(menuConfig => this.setMenuListAppearance(menuConfig));
    }

    openDropdown(openedMenu: Menu): void {
        this.menuList$ = this.menuList$.pipe(map(ml => this.setOpenedMenuList(ml, openedMenu)));
        this.handleMenu();
    }

    hide(): void {
        this.offCanvas?.hide();
    }

    private setOpenedMenuList(menuList: Menu[], openedMenu: Menu): Menu[] {
        return menuList.map(m => { m.isOpened = m.path === openedMenu.path; return m });
    }

    private setMenuListAppearance(menuConfigs: MenuConfig[]): void {
        menuConfigs.forEach(mwe => this.setMenuAppearance(mwe));
    }

    private setMenuAppearance(menuConfig: MenuConfig): void {
        if (menuConfig.menu.isOpened) {
            this.renderer2.addClass(menuConfig.el, 'show');
            this.renderer2.addClass(menuConfig.parentEl, 'active');
        } else {
            this.renderer2.removeClass(menuConfig.el, 'show');
            this.renderer2.removeClass(menuConfig.parentEl, 'active');
        }
    }

    private getMenuListDropdownElement(menuList: Menu[]): any[] {
        return menuList.map(menu => this.getMenuDropdownElement(menu));
    }

    private getMenuDropdownElement(menu: Menu): MenuConfig {
        const el = this.offCanvasElem?.nativeElement.querySelector(`ul[menuPath='${menu.path}']`);
        const parentEl = el.parentElement.querySelector(`div[menuParent='${menu.path}']`);
        return { menu, el, parentEl };
    }

}
