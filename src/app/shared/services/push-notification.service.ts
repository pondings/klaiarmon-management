import { Injectable } from "@angular/core";
import { Timestamp } from "firebase/firestore";
import { Action } from "src/app/common/enum/action";
import { removeArrDuplicated, stringFormat } from "src/app/common/utils/common-util";
import { getMoment } from "src/app/common/utils/moment.util";
import { filterUidNotEqualToUpdatedBy, filterUidNotMatch, mapToUid, transformUsername } from "src/app/common/utils/user.util";
import { UserNotification } from "src/app/core/models/notification.model";
import { DataService } from "src/app/core/services/data-service";
import { FireAuthService } from "src/app/core/services/fire-auth.service";
import { Expense } from "src/app/pages/accounting/expense/model/expense.model";
import { CalendarEventDto } from "src/app/pages/dashboard/model/calendar";
import { UsernamePipe } from "../pipe/username.pipe";

import { 
    CALENDAR_CONTENT_NOTIFICATION_TEMPLATE, 
    CALENDAR_TITLE_NOTIFICATION_TEMPLATE, 
    EXPENSE_CONTENT_NOTIFICATION_TEMPLATE, 
    EXPENSE_DETAIL_NOTIFICATION_TEMPLATE, 
    EXPENSE_TITLE_NOTIFICATION_TEMPLATE 
} from "src/app/common/constants/notification-template";

@Injectable()
export class PushNotificationService {

    constructor(private dataService: DataService,
        private fireAuthService: FireAuthService,
        private usernamePipe: UsernamePipe) {}

    async pushExpenseNotification(expense: Expense, action: Action): Promise<void> {
        const notiUsers = expense.billings.map(billing => billing.user).concat([expense.paidBy])
            .filter(filterUidNotEqualToUpdatedBy(expense))
            .filter(removeArrDuplicated);
        if (!notiUsers[0]) return;

        const contentAction = action === Action.CREATE ? 'add new' : action === Action.UPDATE ? 'edit' : 'delete';
        const details = await Promise.all(expense.billings.map(async billing => {
            const username = await this.usernamePipe.transform(billing.user);
            return stringFormat(EXPENSE_DETAIL_NOTIFICATION_TEMPLATE, username, billing.amount.toFixed(2));
        }));
        const notiUsernames = await Promise.all(notiUsers.map(transformUsername(this.usernamePipe)));
        const userAction = await this.usernamePipe.transform(expense.meta.updatedBy!);

        const title = stringFormat(EXPENSE_TITLE_NOTIFICATION_TEMPLATE, userAction);
        const content = stringFormat(EXPENSE_CONTENT_NOTIFICATION_TEMPLATE, notiUsernames.join(', '), userAction, contentAction, expense.name,
            expense.amount.toFixed(2), getMoment(expense.date.toDate())?.format('DD/MM/YYYY')!, details.join(''));
        await this.pushNotification(title, content, notiUsers);
    }

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
