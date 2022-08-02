import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Menu } from "src/app/model/menu";
import { MenuService } from "src/app/service/menu.service";
import { SidebarService } from "./sidebar.service";

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

    isShow$: BehaviorSubject<boolean>;
    subMenuList$: Observable<Menu[]>;

    constructor(private sidebarService: SidebarService,
        private menuService: MenuService) {
        this.isShow$ = sidebarService.isShow$;
        this.subMenuList$ = menuService.subMenuList$;
    }

    show(): void {
        this.sidebarService.show();
    }

}
