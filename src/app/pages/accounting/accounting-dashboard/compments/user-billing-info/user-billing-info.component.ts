import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from "@angular/core";
import { UserBillingInfo } from "../../model/user-billing-info.model";

@Component({
    selector: 'app-user-billing-info',
    templateUrl: './user-billing-info.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class UserBillingInfoComponent {

    @Input()
    userBillingInfos!: UserBillingInfo[];

}
