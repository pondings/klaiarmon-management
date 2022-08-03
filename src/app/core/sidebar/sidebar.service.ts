import { Injectable } from "@angular/core";
import { Subject, take } from "rxjs";

@Injectable()
export class SidebarService {

    toggle$ = new Subject<void>();

    public toggle(): void {
        this.toggle$.next();
    }

}
