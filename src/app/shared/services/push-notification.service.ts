import { Injectable } from "@angular/core";
import { Timestamp } from "firebase/firestore";
import { Action } from "src/app/common/enum/action";
import { removeArrDuplicated, stringFormat } from "src/app/common/utils/common-util";
import { getMoment } from "src/app/common/utils/moment.util";
import { filterUidNotMatch, mapToUid, transformUsername } from "src/app/common/utils/user.util";
import { UserNotification } from "src/app/core/models/notification.model";
import { DataService } from "src/app/core/services/data-service";
import { FireAuthService } from "src/app/core/services/fire-auth.service";
import { CalendarEventDto } from "src/app/pages/dashboard/calendar/models/calendar";
import { UsernamePipe } from "../pipe/username.pipe";

import { 
    CALENDAR_CONTENT_NOTIFICATION_TEMPLATE, 
    CALENDAR_TITLE_NOTIFICATION_TEMPLATE, 
} from "src/app/common/constants/notification-template";

@Injectable()
export class PushNotificationService {

    constructor(private dataService: DataService,
        private fireAuthService: FireAuthService,
        private usernamePipe: UsernamePipe) {}

    async pushCalendarNotification(calendarDto: CalendarEventDto, action: Action): Promise<void> {
        const allUser = await this.fireAuthService.getAllUsers();
        const currentUser = await this.fireAuthService.getCurrentUser();
        const userAction = action === Action.CREATE ? 'add' : action === Action.UPDATE ? 'edit' : 'delete';

        const notiUsers = allUser.filter(filterUidNotMatch(currentUser.uid!)).map(mapToUid);
        const notiUserNames = await Promise.all(notiUsers.map(transformUsername(this.usernamePipe)));
        
        const title = stringFormat(CALENDAR_TITLE_NOTIFICATION_TEMPLATE, currentUser.displayName!);
        const content = stringFormat(CALENDAR_CONTENT_NOTIFICATION_TEMPLATE, notiUserNames.join(', '), currentUser.displayName!,
            userAction, calendarDto.title, getMoment(calendarDto.start.toDate())?.format('DD/MM/YYYY')!, calendarDto.meta.description!);
        await this.pushNotification(title, content, notiUsers);
    }

    async pushNotification(title: string, content: string, to: string[], isAlert = false): Promise<void> {
        to = to.filter(removeArrDuplicated);
        const notification: UserNotification = { title, content, isAlert, date: Timestamp.now(), meta: {}, to, readed: [] };
        await this.dataService.addDocument('notification', notification, { showSpinner: false });
    }

}
