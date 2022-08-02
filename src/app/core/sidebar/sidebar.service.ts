import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class SidebarService {

    isShow$ = new BehaviorSubject(false);

    public show(): void {
        this.isShow$.next(true);
    }

    public hide(): void {
        this.isShow$.next(false);
    }

}
