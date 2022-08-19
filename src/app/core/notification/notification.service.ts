import { Injectable } from "@angular/core";
import { QueryFn } from "@angular/fire/compat/firestore";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable } from "rxjs";
import { getMoment } from "src/app/common/utils/moment.util";
import { CommonModalComponent } from "src/app/shared/components/common-modal/common-modal.component";
import { UserNotification } from "../models/notification.model";
import { DataService } from "../services/data-service";
import { FireAuthService } from "../services/fire-auth.service";

@Injectable()
export class NotificationService {

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
            .where('isAlert', '==', false)
            .orderBy('date', 'desc')
            .limit(10);
        this.notifications$ = this.dataService.subscribeCollection<UserNotification>(`notification`, { query })
            .pipe(map(notis => notis.map(this.mapMetaIsRead(currentUser.uid!))));
        
        const alertNotiQuery: QueryFn = ref => ref.where('to', 'array-contains', currentUser.uid)
            .where('isAlert', '==', true)
            .orderBy('date', 'desc')
            .limit(1);
        this.alertNotification$ = this.dataService.subscribeCollection<UserNotification>('notification', { query: alertNotiQuery });
        this.alertNotification$.subscribe(async notis => Promise.all(notis.map(async noti => {
            const modalRef = this.getNotificationModal(noti);
            await modalRef.result.then(() => this.markNotificationAsRead(noti), () => {});
        })));
    }

    async openNotificationModal(noti: UserNotification): Promise<void> {
        const modalRef = this.getNotificationModal(noti);

        await this.markNotificationAsRead(noti);
        await modalRef.result.then(_ => {}, _ => {});
    }

    private getNotificationModal(noti: UserNotification): NgbModalRef {
        const modalRef = this.modalService.open(CommonModalComponent, { centered: true, backdrop: 'static' });
        const contentDate = `<div class="noti-content-date">${getMoment(noti.date.toDate())?.format('DD/MM/YYYY HH:mm')}</div>`;

        modalRef.componentInstance.title = noti.title;
        modalRef.componentInstance.content = `${noti.content}${contentDate}`;
        return modalRef;
    }

    private async markNotificationAsRead(noti: UserNotification): Promise<void> {
        const user = await this.fireAuthService.getCurrentUser();
        if (!noti.readed.includes(user.uid!)) noti.readed?.push(user.uid!);

        delete noti.meta.isReaded;
        await this.dataService.updateDocument('notification', noti, { showSpinner: false });
    }

    private mapMetaIsRead(uid: string): (noti: UserNotification) => UserNotification {
        return noti => ({ ...noti, meta: { ...noti.meta, isReaded: noti.readed.includes(uid) } });
    }

}
