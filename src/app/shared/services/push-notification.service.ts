import { Injectable } from "@angular/core";
import { Timestamp } from "firebase/firestore";
import { removeArrDuplicated } from "src/app/common/utils/common-util";
import { UserNotification } from "src/app/core/models/notification.model";
import { DataService } from "src/app/core/services/data-service";

@Injectable()
export class PushNotificationService {

    constructor(private dataService: DataService) {}

    async pushNotification(title: string, content: string, to: string[], isAlert = false): Promise<void> {
        to = to.filter(removeArrDuplicated);
        const notification: UserNotification = { title, content, isAlert, date: Timestamp.now(), meta: {}, to, readed: [] };
        await this.dataService.addDocument('notification', notification, { showSpinner: false });
    }

}
