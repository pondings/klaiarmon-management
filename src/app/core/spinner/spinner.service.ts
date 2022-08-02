import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class SpinnerService {

    isShowSpinner$ = new BehaviorSubject(false);

    show(): void {
        this.isShowSpinner$.next(true);
    }

    hide(): void {
        this.isShowSpinner$.next(false);
    }

}
