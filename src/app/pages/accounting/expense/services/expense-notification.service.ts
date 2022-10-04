import { Injectable } from "@angular/core";
import { EXPENSE_CONTENT_NOTIFICATION_TEMPLATE, EXPENSE_DETAIL_NOTIFICATION_TEMPLATE, EXPENSE_TITLE_NOTIFICATION_TEMPLATE } from "src/app/common/constants/notification-template";
import { Action } from "src/app/common/enum/action";
import { removeArrDuplicated, stringFormat } from "src/app/common/utils/common-util";
import { getMoment } from "src/app/common/utils/moment.util";
import { filterUidNotEqualToUpdatedBy, transformUsername } from "src/app/common/utils/user.util";
import { UsernamePipe } from "src/app/shared/pipe/username.pipe";
import { PushNotificationService } from "src/app/shared/services/push-notification.service";
import { Expense } from "../model/expense.model";

@Injectable()
export class ExpenseNotificationService {

    constructor(private pushNotificationService: PushNotificationService,
        private usernamePipe: UsernamePipe) {}

    async pushNotification(expense: Expense, action: Action): Promise<void> {
        const notiUsers = expense.billings.map(billing => billing.user).concat([expense.paidBy])
            .filter(filterUidNotEqualToUpdatedBy(expense))
            .filter(removeArrDuplicated);
        if (!notiUsers[0]) return;

        const contentAction = action === Action.CREATE ? 'added the new' : action === Action.UPDATE ? 'updated the' : 'deleted the';
        const details = await Promise.all(expense.billings.map(async billing => {
            const username = await this.usernamePipe.transform(billing.user);
            return stringFormat(EXPENSE_DETAIL_NOTIFICATION_TEMPLATE, username, billing.amount.toFixed(2));
        }));
        const notiUsernames = await Promise.all(notiUsers.map(transformUsername(this.usernamePipe)));
        const userAction = await this.usernamePipe.transform(expense.meta.updatedBy!);

        const title = stringFormat(EXPENSE_TITLE_NOTIFICATION_TEMPLATE, userAction);
        const content = stringFormat(EXPENSE_CONTENT_NOTIFICATION_TEMPLATE, notiUsernames.join(', '), userAction, contentAction, expense.name,
            expense.amount.toFixed(2), getMoment(expense.date.toDate())?.format('DD/MM/YYYY')!, details.join(''));
        await this.pushNotificationService.pushNotification(title, content, notiUsers);
    }

}
