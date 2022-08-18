import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
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
        const query: QueryFn = ref => ref.where('to', 'array-contains', currentUser.uid)
            .orderBy('date', 'desc')
            .limit(5);

        this.userNotification$ = this.dataService.subscribeCollection<UserNotification>(`notification`, { query });
        this.notifications$ = this.userNotification$.pipe(map(notis => notis.filter(noti => !noti.isAlert)));
        this.alertNotification$ = this.userNotification$.pipe(map(notis => notis.filter(noti => noti.isAlert)));
        this.alertNotification$.subscribe(async notis => Promise.all(notis.map(async noti => {
            await this.openNotificationModal(noti);
        })));
    }

    async openNotificationModal(noti: UserNotification): Promise<void> {
        const modalRef = this.modalService.open(CommonModalComponent, { centered: true });
        const contentDate = `<div class="noti-content-date">${getMoment(noti.date.toDate())?.format('DD/MM/YYYY HH:mm')}</div>`;

        modalRef.componentInstance.title = noti.title;
        modalRef.componentInstance.content = `${noti.content}${contentDate}`;
        this.markNotificationAsRead(noti);
    }

    private async markNotificationAsRead(noti: UserNotification): Promise<void> {
        const user = await this.fireAuthService.getCurrentUser();
        noti.to = noti.to.filter(t => t !== user.uid);
        noti.readed?.push(user.uid!);
        await this.dataService.updateDocument('notification', noti, { showSpinner: false });
    }

}
