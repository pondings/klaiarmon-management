import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable } from "rxjs";
import { CommonModalComponent } from "src/app/shared/components/common-modal/common-modal.component";
import { UserNotification } from "../models/notification.model";
import { DataService } from "../services/data-service";
import { FireAuthService } from "../services/fire-auth.service";

@Injectable()
export class NotificationService {

    userNotification$!: Observable<UserNotification[]>;
    notifications$!: Observable<UserNotification[]>;
    alertNotification$!: Observable<UserNotification[]>;

    constructor(private fireAuthService: FireAuthService,
        private dataService: DataService,
        private modalService: NgbModal) {
    }

    subscribeNotifications(): Observable<UserNotification[]> {
        return this.notifications$;
    }

    subscribeAlertNotifications(): Observable<UserNotification[]> {
        return this.alertNotification$;
    }

    async initNotificationService(): Promise<void> {
        const currentUser = await this.fireAuthService.getCurrentUser();
        const query: QueryFn = ref => ref.where('to', '==', currentUser.uid)
            .where('isRead', '==', false);

        this.userNotification$ = this.dataService.subscribeCollection<UserNotification>(`notification`, { query });
        this.notifications$ = this.userNotification$.pipe(map(notis => notis.filter(noti => !noti.isAlert)));
        this.alertNotification$ = this.userNotification$.pipe(map(notis => notis.filter(noti => noti.isAlert)));
    }

    async openNotificationModal(noti: UserNotification): Promise<void> {
        const modalRef = this.modalService.open(CommonModalComponent, { centered: true });
        modalRef.componentInstance.title = noti.title;
        modalRef.componentInstance.content = noti.content;

        await modalRef.result.then(_ => this.markNotificationAsRead(noti), _ => this.markNotificationAsRead(noti));
    }

    private async markNotificationAsRead(noti: UserNotification): Promise<void> {
        noti.isRead = true;
        await this.dataService.updateDocument('notification', noti, { showSpinner: false });
    }

}
