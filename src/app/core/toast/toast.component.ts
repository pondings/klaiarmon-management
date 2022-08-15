import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { ToastOption } from "./toast.model";
import { ToastService } from "./toast.service";

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class ToastComponent {

    toastOption$: BehaviorSubject<ToastOption>;

    constructor(private toastService: ToastService) {
        this.toastOption$ = toastService.toastOption$;
    }

    hide(): void {
        this.toastService.hide();
    }

    get toastType$(): Observable<string | undefined> {
        return this.toastOption$.pipe(map(option => option.type));
    }

    get toastMessage$(): Observable<string | undefined> {
        return this.toastOption$.pipe(map(option => option.message));
    }

    get toastClass$(): Observable<any> {
        return this.toastOption$.pipe(map(option => {
            const type = option.type;
            if (type === 'error') {
                return { 'bg-danger': true, 'text-light': true };
            } else if (type === 'success') {
                return { 'bg-success': true, 'text-light': true }
            } else if (type === 'info') {
                return { 'bg-info': true, 'text-light': true }
            } else if (type === 'warning') {
                return { 'bg-warning': true }
            } else {
                return {  };
            }
        }));
    }

}
