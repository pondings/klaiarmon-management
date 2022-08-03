import { Injectable } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject, filter, map, Observable, startWith } from "rxjs";
import { Menu, MENU_LIST } from "../model/menu";

@Injectable({ providedIn: 'root' })
export class MenuService {

    menuList$ = new BehaviorSubject<Menu[]>(MENU_LIST);
    subMenuList$: Observable<Menu[]>;

    constructor(router: Router) {
        this.subMenuList$ = router.events.pipe(filter(this.isNavigationEnd),
            map(this.mapNavigationEndToUrl),
            startWith('dashboard'),
            map(this.mapUrlToMenu),
            map(this.mapMenuToSubMenuList))
    }

    private isNavigationEnd(event: Event): boolean {
        return event instanceof NavigationEnd;
    }

    private mapNavigationEndToUrl(event: Event): string {
        const url = (event as NavigationEnd).urlAfterRedirects;
        return url.startsWith('/') 
            ? url.replace('/', '').split('/')[0]
            : url.split('/')[0];
    }

    private mapUrlToMenu(url: string): Menu | undefined {
        return MENU_LIST.find(menu => menu.path === url);
    }

    private mapMenuToSubMenuList(menu: Menu | undefined): Menu[] {
        return (menu || {}).subMenuList || [];
    }

}
