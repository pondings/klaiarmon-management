import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { map, Observable } from "rxjs";
import { UserNotification } from "../models/notification.model";
import { NotificationService } from "./notification.service";

@Component({
    selector: 'app-notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class NotificationComponent implements OnInit {

    faBell = faBell;

    notifications$!: Observable<UserNotification[]>;
    totalNotification$!: Observable<number>;
    hasNotification$!: Observable<boolean>;

    constructor(private notificationService: NotificationService,
        private cdr: ChangeDetectorRef) {}

    async ngOnInit(): Promise<void> {
        await this.notificationService.initNotificationService();
        this.notifications$ = this.notificationService.subscribeNotifications();

        this.totalNotification$ = this.notifications$.pipe(map(notis => notis.filter(noti => noti.meta.isReaded === false).length));
        this.totalNotification$.subscribe(console.log);
        this.hasNotification$ = this.totalNotification$.pipe(map(total => total > 0));
        this.notifications$.subscribe(_ => this.cdr.detectChanges());
    }

    async openNotification(noti: UserNotification): Promise<void> {
        await this.notificationService.openNotificationModal(noti);
    }

}
