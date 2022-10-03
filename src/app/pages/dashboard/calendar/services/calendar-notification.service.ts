import { Injectable } from "@angular/core";
import { CALENDAR_CONTENT_NOTIFICATION_TEMPLATE, CALENDAR_TITLE_NOTIFICATION_TEMPLATE } from "src/app/common/constants/notification-template";
import { Action } from "src/app/common/enum/action";
import { stringFormat } from "src/app/common/utils/common-util";
import { getMoment } from "src/app/common/utils/moment.util";
import { filterUidNotMatch, mapToUid, transformUsername } from "src/app/common/utils/user.util";
import { FireAuthService } from "src/app/core/services/fire-auth.service";
import { UsernamePipe } from "src/app/shared/pipe/username.pipe";
import { PushNotificationService } from "src/app/shared/services/push-notification.service";
import { CalendarEventDto } from "../models/calendar";

@Injectable()
export class CalendarNotificationService {

    constructor(private fireAuthService: FireAuthService,
        private usernamePipe: UsernamePipe,
        private pushNotificationService: PushNotificationService) {}

    async pushNotification(calendarDto: CalendarEventDto, action: Action): Promise<void> {
        const allUser = await this.fireAuthService.getAllUsers();
        const currentUser = await this.fireAuthService.getCurrentUser();
        const userAction = action === Action.CREATE ? 'add new' : action === Action.UPDATE ? 'update' : 'delete';

        const notiUsers = allUser.filter(filterUidNotMatch(currentUser.uid!)).map(mapToUid);
        const notiUserNames = await Promise.all(notiUsers.map(transformUsername(this.usernamePipe)));
        
        const title = stringFormat(CALENDAR_TITLE_NOTIFICATION_TEMPLATE, currentUser.displayName!);
        const content = stringFormat(CALENDAR_CONTENT_NOTIFICATION_TEMPLATE, notiUserNames.join(', '), currentUser.displayName!,
            userAction, calendarDto.title, getMoment(calendarDto.start.toDate())?.format('DD/MM/YYYY')!, calendarDto.meta.description!);
        await this.pushNotificationService.pushNotification(title, content, notiUsers);
    }

}
