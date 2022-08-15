import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastOption } from './toast.model';

@Injectable()
export class ToastService {

    toastOption$ = new BehaviorSubject<ToastOption>({});

    show(message: string): void {
        this.toastOption$.next({ message });
    }

    showInfo(message: string): void {
        this.toastOption$.next({ type: 'info', message });
    }
    
    showWarning(message: string): void {
        this.toastOption$.next({ type: 'warning', message });
    }

    showSuccess(message: string): void {
        this.toastOption$.next({ type: 'success', message });
    }

    showError(message: string): void {
        this.toastOption$.next({ type: 'error', message });
    }

    hide(): void {
        this.toastOption$.next({});
    }

}
