import { Injectable } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject, filter } from "rxjs";
import { Menu, MENU_LIST } from "../model/menu";

@Injectable({ providedIn: 'root' })
export class MenuService {

    menuList$ = new BehaviorSubject<Menu[]>(MENU_LIST);
    subMenuList$ = new BehaviorSubject<Menu[]>([]);

    constructor(router: Router) {
        router.events.pipe(filter(this.isNavigationEnd))
            .subscribe(console.log);
    }

    private isNavigationEnd(event: Event): boolean {
        return event instanceof NavigationEnd;
    }

}
