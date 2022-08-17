import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { faBell } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class NotificationComponent {

    faBell = faBell;

}
