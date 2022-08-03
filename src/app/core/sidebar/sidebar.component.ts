import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Menu } from "src/app/model/menu";
import { MenuService } from "src/app/service/menu.service";
import { SidebarService } from "./sidebar.service";
import { Offcanvas } from 'bootstrap';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

    offCanvas: Offcanvas | undefined;
    isShow$: BehaviorSubject<boolean>;
    subMenuList$: Observable<Menu[]>;

    constructor(public sidebarService: SidebarService,
        private menuService: MenuService) {
        this.isShow$ = sidebarService.isShow$;
        this.subMenuList$ = menuService.subMenuList$;
    }

    ngOnInit(): void {
        this.offCanvas = new Offcanvas('#offCanvas');
        this.isShow$.subscribe(isShow => isShow ? this.show() : this.hide());
    }

    show(): void {
        this.offCanvas?.show();
    }

    hide(): void {
        this.offCanvas?.hide();
    }

}
